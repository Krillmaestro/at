# How to Run the Skiing Video Analyzer

## Step 1: Check if Python is Installed

Open a terminal (or Command Prompt on Windows) and type:

```
python --version
```

If you see something like `Python 3.10.0` → Great! Go to Step 2.

If you see an error → You need to install Python first:
- Go to: https://www.python.org/downloads/
- Click the big yellow "Download Python" button
- Run the installer
- **IMPORTANT:** Check the box that says "Add Python to PATH" ✓
- Click "Install Now"

---

## Step 2: Install the Required Libraries

Open a terminal/Command Prompt and copy-paste this EXACTLY:

```
pip install opencv-python pillow openpyxl
```

Press Enter and wait until it finishes.

You should see "Successfully installed..." messages.

---

## Step 3: Run the Program

In the terminal, navigate to where you saved the files. Then type:

```
python skiing_video_analyzer.py
```

A window will open! 🎉

---

## Step 4: How to Use the Program

### Loading a Video
1. Click the **"Load Video"** button
2. Find your skiing video file (MP4, MOV, or AVI)
3. Click "Open"

### Recording Gate Times
1. Click **"Play"** to start the video
2. Watch the skier
3. When the skier passes a gate, press **SPACEBAR** on your keyboard
4. The time appears in the list on the right side
5. Keep pressing SPACEBAR for each gate

### Changing Speed
- Click on **0.25x** to make video very slow (best for accuracy)
- Click on **0.5x** for slow
- Click on **0.75x** for medium
- Click on **1.0x** for normal speed

### Saving Your Times
1. Click **"Export to Excel"**
2. Choose where to save the file
3. Click "Save"
4. Open the file in Excel to see your times!

---

## Troubleshooting

### "python is not recognized"
→ Python is not installed or not in PATH. Reinstall Python and check "Add to PATH".

### "No module named cv2"
→ Run this again: `pip install opencv-python`

### "No module named PIL"
→ Run this again: `pip install pillow`

### "No module named openpyxl"
→ Run this again: `pip install openpyxl`

### Video won't load
→ Make sure it's an MP4, MOV, or AVI file

---

## Quick Summary

1. Install Python (if needed)
2. Run: `pip install opencv-python pillow openpyxl`
3. Run: `python skiing_video_analyzer.py`
4. Load video → Play → Press SPACEBAR at each gate → Export to Excel

That's it! 🎿
