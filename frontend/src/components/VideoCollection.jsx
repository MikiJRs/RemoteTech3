import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';

const apiUrl = import.meta.env.VITE_BE_URL;

const VideoCollection = () => {
  const navigate = useNavigate();
  const { interviewId } = useParams(); // interviewId parametresini alıyoruz
  const [videos, setVideos] = useState([]);

  // Videoları backend'den çekme
  useEffect(() => {
    if (interviewId) { // interviewId tanımlı mı kontrol et
      console.log("Fetching videos for interviewId:", interviewId); // Debug için interviewId'yi loglayın
      fetchVideos();
    } else {
      console.error("interviewId parametresi eksik.");
    }
  }, [interviewId]);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${apiUrl}/videos/${interviewId}`);
      const videoData = await Promise.all(
        response.data.map(async (video) => {
          // Video URL'sini al ve Blob olarak dönüştür
          const videoResponse = await axios.get(video.s3Url, { responseType: 'blob' });
          const videoBlobUrl = URL.createObjectURL(videoResponse.data);
          return { ...video, blobUrl: videoBlobUrl };
        })
      );
      setVideos(videoData);
    } catch (error) {
      console.error("Videolar alınırken bir hata oluştu:", error);
    }
  };

  // Video silme işlemi
  const deleteVideo = async (id) => {
    try {
      const response = await axios.delete(`${apiUrl}/videos/${id}`, {
        data: { interviewId }
      });
      if (response.status === 204) { // 204 No Content başarılı silme yanıtıdır
        setVideos(videos.filter((video) => video._id !== id));
        console.log(`Video ${id} başarıyla silindi.`);
      } else {
        console.error("Video silinemedi:", response);
      }
    } catch (error) {
      console.error('Video silinirken bir hata oluştu:', error);
    }
  };

  return (
    <div className="relative h-screen">
      {/* Sol Münü (arka planda tam ekran kaplayacak) */}
      <div className="fixed top-0 left-0 h-full w-full bg-gradient-to-b from-[#004D61] to-[#002D3A] z-0">
        {/* Münü içeriği %20'lik alana sığdırılacak */}
        <div className="h-[20%] w-[20%] p-6 flex flex-col items-center">
          <img src="/remote.svg" alt="Admin Panel Logo" className="w-36 h-36 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2 text-left w-full">Menu</h3>
          <hr className="border-t-2 border-white mb-4 w-full" />
          <ul className="w-full">
            <li className="mb-4">
              <a
                onClick={() => navigate('/manage-question-package')}
                className={`text-gray-200 hover:text-[#00A19D] cursor-pointer px-4 py-2 rounded-md w-full transition-colors duration-200 ${window.location.pathname.includes('/manage-question-package') || window.location.pathname === '/'
                  ? 'bg-[#003843] text-white'
                  : ''
                  }`}
              >
                Manage Question Package
              </a>
            </li>
            <li>
              <a
                onClick={() => navigate('/interviewlist')}
                className={`text-gray-200 hover:text-[#00A19D] cursor-pointer px-4 py-2 rounded-md w-full transition-colors duration-200 ${window.location.pathname.includes('/interviewlist') ? 'bg-[#003843] text-white' : ''
                  }`}
              >
                Interview List
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Sağ İçerik */}
      <div className="absolute right-0 w-[80%] h-full bg-[#F9F9F9] z-10 rounded-l-[40px] overflow-hidden shadow-lg p-8">
        <div className="flex justify-between items-center p-3 border-b border-gray-300">
          <h1 className="text-xl font-semibold text-[#002D3A]">Video Collection</h1>
          <button
            className="bg-[#004D61] text-white px-3 py-2 rounded-md hover:bg-[#003843] transition"
            onClick={() => navigate('/login')}
          >
            Logout
          </button>
        </div>

        {/* Video Bölümü */}
        <div className="p-4 grid grid-cols-4 gap-4">
          {videos.length > 0 ? (
            videos.map((video) => (
              <div
                key={video._id}
                className="relative flex flex-col border border-gray-200 rounded-lg shadow-lg bg-white hover:shadow-xl transition-all duration-300"
              >
                {/* Tam Yuvarlak Delete Butonu */}
                <button
                  className="absolute top-2 right-2 bg-[#004D61] text-white p-2 rounded-full hover:bg-[#003843] transition-all flex items-center justify-center z-10"
                  onClick={(e) => {
                    e.stopPropagation(); // Video tıklamasını engelleme
                    deleteVideo(video._id);
                  }}
                >
                  <FaTrashAlt className="w-4 h-4" />
                </button>

                {/* Video Kısmı */}
                <div className="flex-1">
                  <video
                    src={video.blobUrl}
                    controls
                    className="w-full h-full rounded-t-lg border-none"
                  ></video>
                </div>

                {/* Video Altındaki Bilgi Çubuğu */}
                <div className="px-2 py-1 bg-gray-100 rounded-b-lg text-sm text-gray-700 text-center">
                  {video.fileName || "Untitled Video"}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-3">Video not found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCollection;
