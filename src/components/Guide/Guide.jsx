import React, { useState } from "react";

function Guide() {

  const [currentStep , setCurrentStep] = useState('1');

  const guideSteps = [
  {
    title: 'Step 1: Login or Sign Up',
    color: 'rose',
    points: [
      'Click "Login" if you already have an account.',
      'New users should click "Sign Up" to register.',
      'Fill in the required details such as email and password.',
      'After signup, you will be automatically logged in.',
      'Ensure you use a strong password for security.',
    ],
  },
  {
    title: 'Step 2: Upload Image',
    color: 'red',
    points: [
      'Click the "Choose File" button to select your image.',
      'Supported formats: PNG, JPG, JPEG.',
      'Maximum size: 5MB.',
      'Preview the selected image before encryption.',
    ],
  },
  {
    title: 'Step 3: Encrypt Image',
    color: 'green',
    points: [
      'Click the "Encrypt" button to generate the encrypted image.',
      'A unique encryption key will be generated and saved.',
      'The encrypted image will be shown for download.',
      'Keep the key secure — it is required for decryption.',
    ],
  },
  {
    title: 'Step 4: Download Encrypted Image',
    color: 'yellow',
    points: [
      'Click "Download" to save the encrypted image to your system.',
      'Save the encryption key separately in a safe place.',
      'Ensure both are shared securely if sending to someone.',
    ],
  },
  {
    title: 'Step 5: Decrypt Image',
    color: 'blue',
    points: [
      'Upload the encrypted image and provide the encryption key.',
      'Click "Decrypt" to restore the original image.',
      'If the key is incorrect, decryption will fail.',
    ],
  },
  {
    title: 'Step 6: Save or Share',
    color: 'indigo',
    points: [
      'Download the decrypted image for personal use.',
      'You may also share it securely via email or cloud.',
      'Always follow proper data security practices.',
    ],
  },
  {
    title: 'Step 7: Reset or Start New',
    color: 'violet',
    points: [
      'Click "Reset" to clear the current session.',
      'You can now start encrypting or decrypting a new image.',
      'Ensure old keys are stored before resetting.',
    ],
  },
];



  return (
    <div>
      <div className="text-3xl text-center py-5 ">
        Guide
      </div>
      <div 
        className="relative flex flex-wrap gap-2 md:flex-row flex-col p-2"
      >

        <div className=" rounded-md h-[22rem] md:w-[68%] overflow-y-auto scrollbar-none">
          {guideSteps.map((step, index) => (
            <div
              key={index}
              className={`border mb-3 bg-${step.color}-200 rounded-lg shadow-sm h-[22rem] bg-card/80 text-card-foreground  `}
            >
              <div className="sticky top-0 text-center p-2 font-semibold bg-primary text-primary-foreground rounded-t-md text-xl ">
                {step.title}
              </div>
              <div className=" p-5  rounded-sm sm:text-lg overflow-y-auto ">
                <ol className="list-decimal list-inside space-y-2 sm:space-y-7 ">
                  {step.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>

        
        <div 
          className="md:sticky top-2 h-[22rem] border p-4 md:w-[30%] rounded-lg shadow bg-primary text-primary-foreground space-y-2 overflow-y-auto"
        >
          <div>
            <h2 className="text-xl font-semibold mb-2 ">💡 Common Tips</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Read each step carefully before moving forward.</li>
              <li>Use the scrollbar on the left to navigate steps.</li>
              <li>Focus on understanding, not just finishing.</li>
              <li>Review previous containers if confused.</li>
            </ul>
          </div>
          <hr />
          <div>
            <h2 className="text-xl font-semibold mb-2 ">🔒 Security Policy</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>All user data is processed securely and never stored unnecessarily.</li>
              <li>Encryption is applied to sensitive content before transmission.</li>
              <li>Sessions are automatically expired after inactivity.</li>
              <li>Do not share access keys or credentials with others.</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Guide;
