import React from "react";

function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Last Updated: 1 January 2025</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Personal Information:</strong> Name, Email address, (optional) Contact details</li>
          <li><strong>Authentication Data:</strong> Login credentials (securely encrypted), Access & refresh tokens</li>
          <li><strong>Usage Data:</strong> Encrypted file metadata (filename, size), Date and time of encryption/decryption</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Authenticate and authorize user access</li>
          <li>Process encryption and decryption of images</li>
          <li>Improve platform performance and reliability</li>
          <li>Communicate service updates or account-related notices</li>
          <li>Enforce platform security and Terms of Use</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. Data Security</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Encryption:</strong> AES for images, RSA for keys</li>
          <li><strong>Key Storage:</strong> Securely stored per-user, not shared</li>
          <li><strong>Decrypted Data:</strong> Not retained after processing</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. Cookies & Tracking</h2>
        <p>
          We use <strong>HttpOnly cookies</strong> to store refresh tokens securely. No third-party tracking cookies are used.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5. Third-Party Sharing</h2>
        <p>We do not sell, trade, or share your personal data or encrypted files with third parties unless required by law.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">6. User Control & Rights</h2>
        <p>
          You have the right to access, update, or delete your personal data, request deletion of stored keys or files,
          and close your account. Contact us at <strong>support@encodex.com</strong>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">7. Data Retention</h2>
        <p>
          Encrypted files are deleted automatically after processing or based on your settings.
          Authentication data is retained until account deletion.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">8. Children’s Privacy</h2>
        <p>Encodex is not intended for users under 13. We do not knowingly collect information from children.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">9. Policy Updates</h2>
        <p>
          We may update this policy. Significant changes will be communicated via email or in-app.
          Continued use implies acceptance of updates.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
        <p>📧 Email: <strong>support@encodex.com</strong></p>
      </section>
    </div>
  );
}

export default PrivacyPolicy;
