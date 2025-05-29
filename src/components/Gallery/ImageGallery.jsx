import React, { useState, useEffect } from 'react';
import { Download, Lock } from 'lucide-react';

const ImageGallery = ({ folderName, userId }) => {
    const [imageUrls, setImageUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
        return <p className="text-center text-gray-500">Loading images...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    if (imageUrls.length === 0 && folderName && userId) {
        return (
            <p className="text-center text-gray-500">
                No images found for User ID "{userId}" in "{folderName}" folder.
            </p>
        );
    } else if (!folderName || !userId) {
        return (
            <p className="text-center text-gray-500">
                Select a folder and provide a User ID to view images.
            </p>
        );
    }

    return (
        <div className="flex flex-wrap gap-4 justify-center p-2 m-2">
            {imageUrls.map((url, index) => {
                const isEncrypted = url.endsWith('.enc');
                const fileName = url.split('/').pop();

                return (
                    <div
                        key={index}
                        className="w-48 border rounded-lg p-3 flex flex-col items-center shadow-sm bg-white"
                    >
                        {isEncrypted ? (
                            <div className="w-40 h-32 flex items-center justify-center bg-gray-100 text-gray-600 rounded">
                                <Lock className="w-6 h-6 mr-2" />
                                <span>Encrypted File</span>
                            </div>
                        ) : (
                            <img
                                src={url}
                                alt={`Image ${index + 1}`}
                                className="w-40 h-32 max-w-full max-h-40 object-contain rounded"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/200?text=Error';
                                    console.error("Image failed to load:", url);
                                }}
                            />
                        )}

                        <p className="mt-2 text-sm text-gray-700 truncate text-center w-full" title={fileName}>
                            {fileName}
                        </p>
                        
                        <a
                            href={url}
                            download
                            className="mt-3 inline-flex items-center gap-1 text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </a>
                    </div>
                );
            })}
        </div>
    );
};

export default ImageGallery;
