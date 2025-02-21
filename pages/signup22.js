import SignUpForm from '../components/SignUpForm'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
          Skapa konto
        </h1>
        <SignUpForm />
      </div>
    </div>
  )
}