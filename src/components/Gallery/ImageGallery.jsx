import React, { useState, useEffect } from 'react';
import { Download, Lock } from 'lucide-react';
import { toast } from 'sonner';

const ImageGallery = ({ folderName, userId }) => {
    const [imageUrls, setImageUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = (url, idx)=>{
    toast.warning(`${url} with index ${idx} is deleted`)
    }
    
    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!userId) {
                    setError("User ID is required to fetch images.");
                    setLoading(false);
                    setImageUrls([]);
                    return;
                }

                const url = `http://localhost:5000/images/${folderName}/${userId}`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                setImageUrls(data);
            } catch (e) {
                setError("Failed to fetch images: " + e.message);
                console.error("Error fetching images:", e);
            } finally {
                setLoading(false);
            }
        };

        if (folderName && userId) {
            fetchImages();
        } else {
            setImageUrls([]);
            if (folderName && !userId) {
                setError("Please enter a User ID to view images.");
            } else {
                setError(null);
            }
        }
    }, [folderName, userId]);

    if (loading) {
        return <p className="text-center text-gray-500 pt-16">Loading images...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    if (imageUrls.length === 0 && folderName && userId) {
        return (
            <p className="text-center text-gray-500 pt-16">
                {`No images found  in ${folderName} folder.`}
            </p>
        );
    } else if (!folderName || !userId) {
        return (
            <p className="text-center text-gray-500 pt-16 ">
                No Folder Selected
            </p>
        );
    }

    return (
        <div className="flex flex-wrap gap-4 justify-center p-2 m-2 transition-opacity opacity-0 duration-200 ease-out animate-fadeIn ">
            {imageUrls.map((url, index) => {
                const isEncrypted = url.endsWith('.enc');
                const fileName = url.split('/').pop();

                return (
                    <div
                        key={index}
                        className="w-48 border border-ring rounded-lg p-3 flex flex-col items-center shadow-sm bg-card text-card-foreground "
                    >
                        {isEncrypted ? (
                            <div className="relative w-32 h-20 flex items-center justify-center rounded bg-gray-500">
                                <img src="src\assets\enc-bg.jpg" className=' object-contain rounded' />
                                <div className='absolute text-white '>
                                    <span>Encrypted File</span>
                                </div>
                            </div>
                        ) : (
                            <img
                                src={url}
                                alt={`Image ${index + 1}`}
                                className="w-32 h-20 rounded-lg "
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/200?text=Error';
                                    console.error("Image failed to load:", url);
                                }}
                            />
                        )}

                        <p className="mt-2 text-sm truncate text-center w-full" title={fileName}>
                            {fileName}
                        </p>
                        <div className='flex align-middle gap-3 mt-2 '>

                            <a
                                href={url}
                                download
                                className="text-sm px-2 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
                                >
                                 Download
                            </a>
                            <div className="text-white cursor-pointer bg-red-500 px-2 py-1.5 rounded hover:bg-red-700" onClick={()=>handleDelete(url, index)}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="17"
                                    height="17"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-trash2-icon lucide-trash-2"
                                >
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    <line x1="10" x2="10" y1="11" y2="17" />
                                    <line x1="14" x2="14" y1="11" y2="17" />
                                </svg>
                                </div>
                            </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ImageGallery;
