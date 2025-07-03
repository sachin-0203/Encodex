import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

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

  const handleDelete = async (idx, dataname)=>{
    try{
      const response = await axios.post('http://localhost:5000/delete-metadata', {
          metadataName: dataname,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if(response.data.success){
        toast.warning('Deleted: Metadata');
        setMetadata((prevMetadata) => prevMetadata.filter((_,i)=> i !== idx ))
      }
    }
    catch(err){
      toast.error('Metadata not deleted')
      console.error(err)
    }
  }
  return (
    <div className="min-h-[17rem] sm:h-[16rem] border rounded-sm basis-1/2 mb-2">
      <div className="flex flex-col h-full">
        <header className="px-5 py-4">
          <div className="text-lg font-bold ">Image MetaData</div>
        </header>

        <div className="px-6 py-3 flex-1 overflow-auto">
          <ul className="space-y-2 text-sm ">
            {metadata.length > 0 ? (
              metadata.map((item, idx) => (
                <li key={idx}>
                  <strong>User ID:</strong> {item.user_id} |{' '}
                  <strong>Recipient:</strong> {item.recipient_name} |{' '}
                  <strong>Original:</strong> {item.original_filename} |{' '}
                  <strong>Encrypted:</strong> {item.encrypted_filename} |{' '}
                  <strong>Public Key:</strong> {item.rcpt_pubkey_name}
                  <span>
                    
                    <svg onClick={()=>handleDelete(idx,item.encrypted_filename)}
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-trash2-icon lucide-trash-2 text-red-400 hover:text-red-500"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                    
                  </span>
                </li>
              ))
            ) : (
              <li className='text-gray-500' >No metadata found for this user.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MetadataActivity;
