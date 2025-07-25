import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 text-justify">
      <h2 className="text-3xl font-bold text-center mb-4">Terms and Conditions</h2>
      <p className="text-sm text-center text-gray-500 mb-6">Last Updated: 1 January 2025</p>
      <p className="text-sm text-center  mb-10">
        | By signing up or using this platform, you agree to the following:
      </p>

      <ol className="list-decimal pl-6 space-y-6">
        <li>
          <p>
            <span className="font-semibold text-lg">User Data:</span> We store only essential user details such as your email and name for authentication purposes. Your data is not shared with third parties.
          </p>
        </li>

        <li>
          <p>
            <span className="font-semibold text-lg">Encryption Key Ownership:</span> You are solely responsible for securely storing your encryption and decryption keys. We do not store decrypted image data or your private keys.
          </p>
        </li>

        <li>
          <p>
            <span className="font-semibold text-lg">File Handling:</span> Uploaded images are temporarily processed and encrypted. We do not retain original or decrypted images once encryption/decryption is completed.
          </p>
        </li>

        <li>
          <p>
            <span className="font-semibold text-lg">Security Guarantee:</span> Encodex uses secure algorithms (AES + RSA hybrid encryption), but we do not guarantee absolute security. Use the platform with awareness of potential digital risks.
          </p>
        </li>

        <li>
          <p>
            <span className="font-semibold text-lg">Acceptable Use:</span> You may not use Encodex to encrypt, store, or transmit illegal or harmful content.
          </p>
        </li>

        <li>
          <p>
            <span className="font-semibold text-lg">Modifications:</span> We may update our terms or services at any time. Continued use after updates indicates your agreement to the revised terms.
          </p>
        </li>

        <li>
          <p>
            <span className="font-semibold text-lg">Termination:</span> Accounts found violating these terms may be restricted or permanently suspended without prior notice.
          </p>
        </li>
      </ol>

      <p className="mt-10 text-center text-sm ">
        | By signing up or continuing, you confirm you’ve read and agreed to these Terms and Conditions.
      </p>
    </div>
  );
};

export default TermsAndConditions;
