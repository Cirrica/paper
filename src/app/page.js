export default function Home() {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md'>
        <h1 className='text-3xl font-bold text-gray-900 mb-6 text-center'>
          Cirrica Authentication
        </h1>

        <div className='space-y-6'>
          <div className='bg-blue-50 p-4 rounded-lg'>
            <h2 className='text-lg font-semibold text-blue-900 mb-2'>
              Login from External Project
            </h2>
            <p className='text-blue-700 text-sm mb-3'>
              Use this endpoint to authenticate users from another project:
            </p>
            <code className='bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-mono'>
              /loginFromToken?token=YOUR_JWT_TOKEN
            </code>
          </div>

          <div className='bg-green-50 p-4 rounded-lg'>
            <h2 className='text-lg font-semibold text-green-900 mb-2'>
              How it works:
            </h2>
            <ol className='list-decimal list-inside text-green-700 text-sm space-y-1'>
              <li>User clicks "Go to Dashboard" in your external project</li>
              <li>
                External project redirects to:{' '}
                <code>/loginFromToken?token=JWT_TOKEN</code>
              </li>
              <li>Token gets saved to localStorage as "cirricaToken"</li>
              <li>User gets redirected to the dashboard</li>
            </ol>
          </div>

          <div className='bg-yellow-50 p-4 rounded-lg'>
            <h2 className='text-lg font-semibold text-yellow-900 mb-2'>
              Example Usage:
            </h2>
            <p className='text-yellow-700 text-sm mb-2'>
              From your external project, redirect users to:
            </p>
            <code className='bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm font-mono block'>
              https://your-domain.com/loginFromToken?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
