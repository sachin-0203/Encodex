import React, { useEffect, useState } from 'react';

const MetadataActivity = ({userId , accessToken}) => {
  const [metadata, setMetadata] = useState([]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await fetch('http://localhost:5000/encrypted/metadata', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setMetadata(data);
      } catch (e) {
        console.error("Failed to fetch metadata:", e);
      }
    };

    fetchMetadata();
  }, [userId]);

  return (
    <div className="h-[17rem] sm:h-[17rem] border rounded-md basis-1/2 mb-4">
      <div className="flex flex-col h-full">
        <header className="px-5 py-4">
          <div className="text-lg font-semibold">Image MetaData</div>
        </header>

        <div className="px-6 py-3 flex-1 overflow-auto">
          <ul className="space-y-2 text-sm">
            {metadata.length > 0 ? (
              metadata.map((item, idx) => (
                <li key={idx}>
                  <strong>User ID:</strong> {item.user_id} |{' '}
                  <strong>Original:</strong> {item.original_filename} |{' '}
                  <strong>Encrypted:</strong> {item.encrypted_filename} |{' '}
                  <strong>Recipient:</strong> {item.recipient_name} |{' '}
                  <strong>Public Key:</strong> {item.rcpt_pubkey_name}
                </li>
              ))
            ) : (
              <li>No metadata found for this user.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MetadataActivity;
