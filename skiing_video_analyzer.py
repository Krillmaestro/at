#!/usr/bin/env python3
"""
Alpine Skiing Video Analyzer - Gate-to-Gate Timing Tool

A desktop application for manually measuring gate-to-gate times in alpine skiing videos.

Installation:
    pip install opencv-python pillow openpyxl

Usage:
    python skiing_video_analyzer.py

Controls:
    - Click "Load Video" to open a video file (mp4, mov, avi)
    - Use speed selector to adjust playback speed
    - Press ENTER to record gate times while video is playing
    - Click "Export to Excel" to save timing data

Author: Alpine Skiing Analysis Tool
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from typing import Optional
import cv2
from PIL import Image, ImageTk
from dataclasses import dataclass
from datetime import datetime
import os


# =============================================================================
# Data Classes
# =============================================================================

@dataclass
class GateTime:
    """Represents a single gate timing record."""
    gate_number: int
    video_timestamp: float  # Timestamp in the video (seconds)
    split_time: float       # Time since previous gate (seconds)


# =============================================================================
# Main Application Class
# =============================================================================

class SkiingVideoAnalyzer:
    """
    Main application class for the Alpine Skiing Video Analyzer.

    Handles video playback, gate timing, and data export functionality.
    """

    # Playback speed options
    SPEED_OPTIONS = {
        "0.25x": 0.25,
        "0.5x": 0.5,
        "0.75x": 0.75,
        "1.0x": 1.0
    }

    # Supported video formats
    VIDEO_FORMATS = [
        ("Video Files", "*.mp4 *.mov *.avi *.mkv *.wmv"),
        ("MP4 Files", "*.mp4"),
        ("MOV Files", "*.mov"),
        ("AVI Files", "*.avi"),
        ("All Files", "*.*")
    ]

    def __init__(self, root: tk.Tk):
        """Initialize the application."""
        self.root = root
        self.root.title("Alpine Skiing Video Analyzer - Gate-to-Gate Timing")
        self.root.geometry("1200x800")
        self.root.minsize(1000, 600)

        # Video state variables
        self.video_capture: Optional[cv2.VideoCapture] = None
        self.video_path: Optional[str] = None
        self.is_playing: bool = False
        self.current_frame_number: int = 0
        self.total_frames: int = 0
        self.fps: float = 30.0
        self.playback_speed: float = 1.0
        self.after_id: Optional[str] = None

        # Timing data
        self.gate_times: list[GateTime] = []
        self.last_timestamp: Optional[float] = None

        # Build the GUI
        self._setup_styles()
        self._create_widgets()
        self._bind_events()

        # Set focus to main window for keyboard events
        self.root.focus_set()

    def _setup_styles(self):
        """Configure ttk styles for the application."""
        style = ttk.Style()
        style.theme_use('clam')

        # Configure custom styles
        style.configure('Title.TLabel', font=('Helvetica', 14, 'bold'))
        style.configure('Info.TLabel', font=('Helvetica', 10))
        style.configure('Speed.TRadiobutton', font=('Helvetica', 10))
        style.configure('Action.TButton', font=('Helvetica', 11, 'bold'), padding=10)

    def _create_widgets(self):
        """Create and layout all GUI widgets."""
        # Main container with padding
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.pack(fill=tk.BOTH, expand=True)

        # Left side: Video display and controls
        left_frame = ttk.Frame(main_frame)
        left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        # Right side: Split times panel
        right_frame = ttk.Frame(main_frame, width=280)
        right_frame.pack(side=tk.RIGHT, fill=tk.Y, padx=(10, 0))
        right_frame.pack_propagate(False)

        # --- Video Display Area ---
        video_frame = ttk.LabelFrame(left_frame, text="Video Player", padding="5")
        video_frame.pack(fill=tk.BOTH, expand=True)

        # Canvas for video display
        self.video_canvas = tk.Canvas(
            video_frame,
            bg='black',
            highlightthickness=0
        )
        self.video_canvas.pack(fill=tk.BOTH, expand=True)

        # Placeholder text
        self.video_canvas.create_text(
            400, 300,
            text="Load a video to begin\n\nSupported formats: MP4, MOV, AVI",
            fill='gray',
            font=('Helvetica', 16),
            justify=tk.CENTER,
            tags='placeholder'
        )

        # --- Progress Bar ---
        progress_frame = ttk.Frame(left_frame)
        progress_frame.pack(fill=tk.X, pady=(5, 0))

        self.progress_var = tk.DoubleVar(value=0)
        self.progress_bar = ttk.Scale(
            progress_frame,
            from_=0,
            to=100,
            orient=tk.HORIZONTAL,
            variable=self.progress_var,
            command=self._on_progress_change
        )
        self.progress_bar.pack(fill=tk.X, side=tk.LEFT, expand=True)

        self.time_label = ttk.Label(
            progress_frame,
            text="00:00.00 / 00:00.00",
            style='Info.TLabel',
            width=20
        )
        self.time_label.pack(side=tk.RIGHT, padx=(10, 0))

        # --- Control Panel ---
        control_frame = ttk.Frame(left_frame)
        control_frame.pack(fill=tk.X, pady=(10, 0))

        # Load Video button
        self.load_btn = ttk.Button(
            control_frame,
            text="📂 Load Video",
            style='Action.TButton',
            command=self._load_video
        )
        self.load_btn.pack(side=tk.LEFT, padx=(0, 10))

        # Play/Pause button
        self.play_btn = ttk.Button(
            control_frame,
            text="▶ Play",
            style='Action.TButton',
            command=self._toggle_playback,
            state=tk.DISABLED
        )
        self.play_btn.pack(side=tk.LEFT, padx=(0, 10))

        # Stop button
        self.stop_btn = ttk.Button(
            control_frame,
            text="⏹ Stop",
            style='Action.TButton',
            command=self._stop_video,
            state=tk.DISABLED
        )
        self.stop_btn.pack(side=tk.LEFT, padx=(0, 20))

        # Speed selection
        speed_label = ttk.Label(control_frame, text="Playback Speed:", style='Info.TLabel')
        speed_label.pack(side=tk.LEFT, padx=(10, 5))

        self.speed_var = tk.StringVar(value="1.0x")
        for speed_text in self.SPEED_OPTIONS.keys():
            rb = ttk.Radiobutton(
                control_frame,
                text=speed_text,
                value=speed_text,
                variable=self.speed_var,
                style='Speed.TRadiobutton',
                command=self._on_speed_change
            )
            rb.pack(side=tk.LEFT, padx=5)

        # --- Instructions ---
        instruction_frame = ttk.Frame(left_frame)
        instruction_frame.pack(fill=tk.X, pady=(10, 0))

        instruction_text = "Press ENTER while video is playing to record gate times"
        instruction_label = ttk.Label(
            instruction_frame,
            text=f"⌨ {instruction_text}",
            font=('Helvetica', 11, 'italic'),
            foreground='#0066cc'
        )
        instruction_label.pack(side=tk.LEFT)

        # --- Split Times Panel (Right Side) ---
        times_header = ttk.Label(
            right_frame,
            text="Gate Times",
            style='Title.TLabel'
        )
        times_header.pack(pady=(0, 10))

        # Frame to hold treeview and scrollbar together
        tree_frame = ttk.Frame(right_frame)
        tree_frame.pack(fill=tk.BOTH, expand=True)

        # Treeview for split times
        columns = ('gate', 'timestamp', 'split')
        self.times_tree = ttk.Treeview(
            tree_frame,
            columns=columns,
            show='headings',
            height=15
        )

        # Configure columns
        self.times_tree.heading('gate', text='Gate #')
        self.times_tree.heading('timestamp', text='Time (s)')
        self.times_tree.heading('split', text='Split (s)')

        self.times_tree.column('gate', width=50, anchor=tk.CENTER)
        self.times_tree.column('timestamp', width=80, anchor=tk.CENTER)
        self.times_tree.column('split', width=80, anchor=tk.CENTER)

        # Scrollbar for treeview
        times_scroll = ttk.Scrollbar(
            tree_frame,
            orient=tk.VERTICAL,
            command=self.times_tree.yview
        )
        self.times_tree.configure(yscrollcommand=times_scroll.set)

        self.times_tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        times_scroll.pack(side=tk.RIGHT, fill=tk.Y)

        # Buttons below the times list
        times_buttons_frame = ttk.Frame(right_frame)
        times_buttons_frame.pack(fill=tk.X, pady=(10, 0))

        # Clear times button
        self.clear_btn = ttk.Button(
            times_buttons_frame,
            text="Clear Times",
            command=self._clear_times
        )
        self.clear_btn.pack(fill=tk.X, pady=(2, 2))

        # Copy to clipboard button (for Google Sheets)
        self.copy_btn = ttk.Button(
            times_buttons_frame,
            text="Copy for Google Sheets",
            command=self._copy_to_clipboard
        )
        self.copy_btn.pack(fill=tk.X, pady=(2, 2))

        # Export to CSV button
        self.csv_btn = ttk.Button(
            times_buttons_frame,
            text="Save as CSV",
            command=self._export_to_csv
        )
        self.csv_btn.pack(fill=tk.X, pady=(2, 2))

        # Export to Excel button
        self.export_btn = ttk.Button(
            times_buttons_frame,
            text="Save as Excel",
            command=self._export_to_excel
        )
        self.export_btn.pack(fill=tk.X, pady=(2, 2))

        # Statistics label
        self.stats_label = ttk.Label(
            right_frame,
            text="Total gates: 0 | Total time: 0.00s",
            style='Info.TLabel'
        )
        self.stats_label.pack(pady=(10, 0))

    def _bind_events(self):
        """Bind keyboard and window events."""
        # Spacebar for gate timing - bind to root for global capture
        # Use KeyPress event for better Mac compatibility
        self.root.bind('<KeyPress>', self._on_key_press)

        # Additional playback controls - use KeyPress handler above for arrows too
        self.root.bind('<p>', lambda e: self._toggle_playback())

        # Window resize event
        self.video_canvas.bind('<Configure>', self._on_canvas_resize)

        # Cleanup on close
        self.root.protocol("WM_DELETE_WINDOW", self._on_close)

    def _on_key_press(self, event):
        """Handle key press events for better Mac compatibility."""
        # Check for Enter key to record gate time
        if event.keysym in ('Return', 'KP_Enter') or event.char == '\r':
            self._record_gate_time(event)
        elif event.keysym == 'Left':
            self._seek_relative(-1)
        elif event.keysym == 'Right':
            self._seek_relative(1)

    def _load_video(self):
        """Open a file dialog and load the selected video."""
        file_path = filedialog.askopenfilename(
            title="Select Video File",
            filetypes=self.VIDEO_FORMATS
        )

        if not file_path:
            return

        # Release any existing video
        if self.video_capture is not None:
            self._stop_video()
            self.video_capture.release()

        # Open the new video
        self.video_capture = cv2.VideoCapture(file_path)

        if not self.video_capture.isOpened():
            messagebox.showerror("Error", f"Could not open video file:\n{file_path}")
            self.video_capture = None
            return

        # Store video properties
        self.video_path = file_path
        self.fps = self.video_capture.get(cv2.CAP_PROP_FPS) or 30.0
        self.total_frames = int(self.video_capture.get(cv2.CAP_PROP_FRAME_COUNT))
        self.current_frame_number = 0

        # Reset timing data when loading new video
        self._clear_times()

        # Update progress bar range
        self.progress_bar.configure(to=self.total_frames)

        # Enable playback controls
        self.play_btn.configure(state=tk.NORMAL)
        self.stop_btn.configure(state=tk.NORMAL)

        # Remove placeholder and show first frame
        self.video_canvas.delete('placeholder')
        self._display_frame()

        # Update window title
        video_name = os.path.basename(file_path)
        self.root.title(f"Alpine Skiing Video Analyzer - {video_name}")

        messagebox.showinfo(
            "Video Loaded",
            f"Loaded: {video_name}\n"
            f"Duration: {self._format_time(self.total_frames / self.fps)}\n"
            f"FPS: {self.fps:.2f}\n\n"
            "Press ENTER to record gate times."
        )

    def _display_frame(self, seek=True):
        """Read and display the current video frame.

        Args:
            seek: If True, seek to frame position first. Set to False for
                  sequential playback (much faster).
        """
        if self.video_capture is None:
            return

        # Only seek if needed (seeking is slow, sequential read is fast)
        if seek:
            self.video_capture.set(cv2.CAP_PROP_POS_FRAMES, self.current_frame_number)

        ret, frame = self.video_capture.read()
        if not ret:
            return

        # Convert BGR to RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Get canvas dimensions
        canvas_width = self.video_canvas.winfo_width()
        canvas_height = self.video_canvas.winfo_height()

        if canvas_width < 10 or canvas_height < 10:
            return

        # Calculate scaling to fit canvas while maintaining aspect ratio
        frame_height, frame_width = frame_rgb.shape[:2]
        scale = min(canvas_width / frame_width, canvas_height / frame_height)

        new_width = int(frame_width * scale)
        new_height = int(frame_height * scale)

        # Resize frame
        frame_resized = cv2.resize(frame_rgb, (new_width, new_height))

        # Convert to PIL Image and then to PhotoImage
        image = Image.fromarray(frame_resized)
        self.photo = ImageTk.PhotoImage(image)

        # Display on canvas (centered)
        x = canvas_width // 2
        y = canvas_height // 2
        self.video_canvas.delete('video')
        self.video_canvas.create_image(x, y, image=self.photo, anchor=tk.CENTER, tags='video')

        # Update progress bar and time label
        self.progress_var.set(self.current_frame_number)
        current_time = self.current_frame_number / self.fps
        total_time = self.total_frames / self.fps
        self.time_label.configure(
            text=f"{self._format_time(current_time)} / {self._format_time(total_time)}"
        )

    def _toggle_playback(self):
        """Toggle between play and pause states."""
        if self.video_capture is None:
            return

        if self.is_playing:
            self._pause_video()
        else:
            self._play_video()

    def _play_video(self):
        """Start video playback."""
        if self.video_capture is None:
            return

        self.is_playing = True
        self.play_btn.configure(text="⏸ Pause")
        self._play_loop()

    def _pause_video(self):
        """Pause video playback."""
        self.is_playing = False
        self.play_btn.configure(text="▶ Play")

        if self.after_id is not None:
            self.root.after_cancel(self.after_id)
            self.after_id = None

    def _stop_video(self):
        """Stop video and reset to beginning."""
        self._pause_video()
        self.current_frame_number = 0
        self._display_frame()

    def _play_loop(self):
        """Main playback loop using tkinter's after() for timing."""
        if not self.is_playing or self.video_capture is None:
            return

        # Move to next frame
        self.current_frame_number += 1

        # Check if we've reached the end
        if self.current_frame_number >= self.total_frames:
            # Loop back to start
            self.current_frame_number = 0
            # Need to seek when looping
            self._display_frame(seek=True)
        else:
            # Sequential read is much faster (no seeking)
            self._display_frame(seek=False)

        # Calculate delay based on FPS and playback speed
        # delay = (1000 ms / fps) / speed_factor
        base_delay = 1000.0 / self.fps
        adjusted_delay = int(base_delay / self.playback_speed)

        # Ensure minimum delay to prevent freezing
        adjusted_delay = max(adjusted_delay, 1)

        # Schedule next frame
        self.after_id = self.root.after(adjusted_delay, self._play_loop)

    def _on_speed_change(self):
        """Handle playback speed change."""
        speed_text = self.speed_var.get()
        self.playback_speed = self.SPEED_OPTIONS.get(speed_text, 1.0)

    def _on_progress_change(self, value):
        """Handle progress bar scrubbing."""
        if self.video_capture is None:
            return

        # Pause during scrubbing for smoother experience
        was_playing = self.is_playing
        if was_playing:
            self._pause_video()

        self.current_frame_number = int(float(value))
        self._display_frame()

    def _seek_relative(self, seconds: float):
        """Seek relative to current position by given seconds."""
        if self.video_capture is None:
            return

        frames_to_seek = int(seconds * self.fps)
        new_frame = self.current_frame_number + frames_to_seek

        # Clamp to valid range
        new_frame = max(0, min(new_frame, self.total_frames - 1))

        self.current_frame_number = new_frame
        self._display_frame()

    def _on_canvas_resize(self, event):
        """Handle canvas resize - redisplay current frame."""
        if self.video_capture is not None and not self.is_playing:
            self._display_frame()

    def _record_gate_time(self, event=None):
        """Record a gate time when spacebar is pressed."""
        if self.video_capture is None:
            messagebox.showwarning("No Video", "Please load a video first.")
            return

        if not self.is_playing:
            messagebox.showinfo("Video Paused", "Video must be playing to record gate times.")
            return

        # Calculate current video timestamp
        current_timestamp = self.current_frame_number / self.fps

        # Calculate split time
        if self.last_timestamp is None:
            # First gate - this is the start
            split_time = 0.0
        else:
            split_time = current_timestamp - self.last_timestamp

        # Create gate time record
        gate_number = len(self.gate_times) + 1
        gate_time = GateTime(
            gate_number=gate_number,
            video_timestamp=round(current_timestamp, 2),
            split_time=round(split_time, 2)
        )

        # Store the record
        self.gate_times.append(gate_time)
        self.last_timestamp = current_timestamp

        # Update the display
        self._add_gate_to_tree(gate_time)
        self._update_statistics()

        # Visual feedback - flash the background
        self._flash_feedback()

    def _add_gate_to_tree(self, gate_time: GateTime):
        """Add a gate time entry to the treeview."""
        # Format split time - show "START" for first gate
        if gate_time.gate_number == 1:
            split_display = "START"
        else:
            split_display = f"{gate_time.split_time:.2f}"

        self.times_tree.insert(
            '',
            tk.END,
            values=(
                gate_time.gate_number,
                f"{gate_time.video_timestamp:.2f}",
                split_display
            )
        )

        # Scroll to show the new entry
        children = self.times_tree.get_children()
        if children:
            self.times_tree.see(children[-1])

    def _update_statistics(self):
        """Update the statistics label."""
        total_gates = len(self.gate_times)

        if total_gates > 1:
            total_time = self.gate_times[-1].video_timestamp - self.gate_times[0].video_timestamp
        else:
            total_time = 0.0

        self.stats_label.configure(
            text=f"Total gates: {total_gates} | Total time: {total_time:.2f}s"
        )

    def _flash_feedback(self):
        """Provide visual feedback when a gate time is recorded."""
        # Flash the stats label background
        original_bg = self.stats_label.cget('background')
        self.stats_label.configure(background='#90EE90')  # Light green
        self.root.after(200, lambda: self.stats_label.configure(background=original_bg))

    def _clear_times(self):
        """Clear all recorded gate times."""
        self.gate_times.clear()
        self.last_timestamp = None

        # Clear treeview
        for item in self.times_tree.get_children():
            self.times_tree.delete(item)

        self._update_statistics()

    def _copy_to_clipboard(self):
        """Copy gate times to clipboard for pasting into Google Sheets."""
        if not self.gate_times:
            messagebox.showwarning("No Data", "No gate times to copy.")
            return

        # Build tab-separated text (works with Google Sheets and Excel)
        lines = ["Gate Number\tVideo Timestamp (s)\tSplit Time (s)"]

        for gate_time in self.gate_times:
            if gate_time.gate_number == 1:
                split_display = "START"
            else:
                split_display = f"{gate_time.split_time:.2f}"

            lines.append(f"{gate_time.gate_number}\t{gate_time.video_timestamp:.2f}\t{split_display}")

        # Copy to clipboard
        text = "\n".join(lines)
        self.root.clipboard_clear()
        self.root.clipboard_append(text)
        self.root.update()  # Required for clipboard to persist

        messagebox.showinfo(
            "Copied!",
            "Gate times copied to clipboard!\n\n"
            "Now go to Google Sheets and press Ctrl+V (or Cmd+V on Mac) to paste."
        )

    def _export_to_csv(self):
        """Export gate times to a CSV file."""
        if not self.gate_times:
            messagebox.showwarning("No Data", "No gate times to export.")
            return

        # Generate default filename
        if self.video_path:
            video_name = os.path.splitext(os.path.basename(self.video_path))[0]
        else:
            video_name = "skiing_analysis"

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        default_filename = f"{video_name}_gate_times_{timestamp}.csv"

        # Ask for save location
        file_path = filedialog.asksaveasfilename(
            title="Save CSV File",
            defaultextension=".csv",
            initialfile=default_filename,
            filetypes=[("CSV Files", "*.csv")]
        )

        if not file_path:
            return

        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                # Write header
                f.write("Gate Number,Video Timestamp (s),Split Time (s)\n")

                # Write data
                for gate_time in self.gate_times:
                    if gate_time.gate_number == 1:
                        split_display = "START"
                    else:
                        split_display = f"{gate_time.split_time:.2f}"

                    f.write(f"{gate_time.gate_number},{gate_time.video_timestamp:.2f},{split_display}\n")

            messagebox.showinfo(
                "Export Successful",
                f"Gate times saved to:\n{file_path}\n\n"
                "You can open this file in Google Sheets or Excel."
            )
        except Exception as e:
            messagebox.showerror("Export Failed", f"Error saving file:\n{str(e)}")

    def _export_to_excel(self):
        """Export gate times to an Excel file."""
        if not self.gate_times:
            messagebox.showwarning("No Data", "No gate times to export.")
            return

        # Try to import openpyxl
        try:
            from openpyxl import Workbook
            from openpyxl.styles import Font, Alignment, Border, Side, PatternFill
        except ImportError:
            messagebox.showerror(
                "Missing Library",
                "openpyxl is required for Excel export.\n\n"
                "Install it with: pip install openpyxl"
            )
            return

        # Generate default filename
        if self.video_path:
            video_name = os.path.splitext(os.path.basename(self.video_path))[0]
        else:
            video_name = "skiing_analysis"

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        default_filename = f"{video_name}_gate_times_{timestamp}.xlsx"

        # Ask for save location
        file_path = filedialog.asksaveasfilename(
            title="Export Gate Times",
            defaultextension=".xlsx",
            initialfile=default_filename,
            filetypes=[("Excel Files", "*.xlsx")]
        )

        if not file_path:
            return

        # Create workbook and worksheet
        wb = Workbook()
        ws = wb.active
        ws.title = "Gate Times"

        # Define styles
        header_font = Font(bold=True, size=12)
        header_fill = PatternFill(start_color="4472C4", end_color="4472C4", fill_type="solid")
        header_font_white = Font(bold=True, size=12, color="FFFFFF")
        center_align = Alignment(horizontal='center', vertical='center')
        thin_border = Border(
            left=Side(style='thin'),
            right=Side(style='thin'),
            top=Side(style='thin'),
            bottom=Side(style='thin')
        )

        # Add headers
        headers = ['Gate Number', 'Video Timestamp (s)', 'Split Time (s)']
        for col, header in enumerate(headers, start=1):
            cell = ws.cell(row=1, column=col, value=header)
            cell.font = header_font_white
            cell.fill = header_fill
            cell.alignment = center_align
            cell.border = thin_border

        # Add data
        for row, gate_time in enumerate(self.gate_times, start=2):
            # Gate number
            cell = ws.cell(row=row, column=1, value=gate_time.gate_number)
            cell.alignment = center_align
            cell.border = thin_border

            # Video timestamp
            cell = ws.cell(row=row, column=2, value=gate_time.video_timestamp)
            cell.alignment = center_align
            cell.border = thin_border
            cell.number_format = '0.00'

            # Split time
            if gate_time.gate_number == 1:
                cell = ws.cell(row=row, column=3, value="START")
            else:
                cell = ws.cell(row=row, column=3, value=gate_time.split_time)
                cell.number_format = '0.00'
            cell.alignment = center_align
            cell.border = thin_border

        # Add summary section
        summary_row = len(self.gate_times) + 3

        ws.cell(row=summary_row, column=1, value="Summary").font = Font(bold=True, size=11)

        ws.cell(row=summary_row + 1, column=1, value="Video File:")
        ws.cell(row=summary_row + 1, column=2, value=os.path.basename(self.video_path) if self.video_path else "N/A")

        ws.cell(row=summary_row + 2, column=1, value="Total Gates:")
        ws.cell(row=summary_row + 2, column=2, value=len(self.gate_times))

        if len(self.gate_times) > 1:
            total_time = self.gate_times[-1].video_timestamp - self.gate_times[0].video_timestamp
            ws.cell(row=summary_row + 3, column=1, value="Total Run Time (s):")
            cell = ws.cell(row=summary_row + 3, column=2, value=total_time)
            cell.number_format = '0.00'

        ws.cell(row=summary_row + 4, column=1, value="Export Date:")
        ws.cell(row=summary_row + 4, column=2, value=datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

        # Adjust column widths
        ws.column_dimensions['A'].width = 15
        ws.column_dimensions['B'].width = 20
        ws.column_dimensions['C'].width = 15

        # Save the file
        try:
            wb.save(file_path)
            messagebox.showinfo(
                "Export Successful",
                f"Gate times exported to:\n{file_path}"
            )
        except PermissionError:
            messagebox.showerror(
                "Export Failed",
                "Could not save file. It may be open in another application."
            )
        except Exception as e:
            messagebox.showerror("Export Failed", f"Error saving file:\n{str(e)}")

    def _format_time(self, seconds: float) -> str:
        """Format seconds as MM:SS.cc"""
        minutes = int(seconds // 60)
        secs = seconds % 60
        return f"{minutes:02d}:{secs:05.2f}"

    def _on_close(self):
        """Clean up resources when closing the application."""
        # Stop playback
        if self.after_id is not None:
            self.root.after_cancel(self.after_id)

        # Release video capture
        if self.video_capture is not None:
            self.video_capture.release()

        # Destroy the window
        self.root.destroy()


# =============================================================================
# Main Entry Point
# =============================================================================

def main():
    """Main entry point for the application."""
    # Check for required dependencies
    missing_deps = []

    try:
        import cv2
    except ImportError:
        missing_deps.append("opencv-python")

    try:
        from PIL import Image
    except ImportError:
        missing_deps.append("pillow")

    try:
        import openpyxl
    except ImportError:
        missing_deps.append("openpyxl")

    if missing_deps:
        print("=" * 60)
        print("Missing required dependencies!")
        print("=" * 60)
        print("\nPlease install the following packages:")
        print(f"\n    pip install {' '.join(missing_deps)}")
        print("\nOr install all at once:")
        print("\n    pip install opencv-python pillow openpyxl")
        print("=" * 60)
        return

    # Create and run the application
    root = tk.Tk()
    app = SkiingVideoAnalyzer(root)
    root.mainloop()


if __name__ == "__main__":
    main()
