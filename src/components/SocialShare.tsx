'use client';

import { useState } from 'react';

interface SocialShareProps {
  sessionId: string;
  percentage: number;
  alignmentLabel: string;
}

export default function SocialShare({ sessionId, percentage, alignmentLabel }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = baseUrl; // Share main domain only, not specific result page
  
  const shareText = `I got ${percentage}% alignment with Charlie Kirk's political positions! My result: ${alignmentLabel}. Take the quiz yourself:`;
  
  const platforms = [
    {
      name: 'Twitter/X',
      icon: '𝕏',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-black hover:bg-gray-800'
    },
    {
      name: 'Facebook',
      icon: '📘',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`,
      color: 'bg-blue-700 hover:bg-blue-800'
    },
    {
      name: 'Reddit',
      icon: '🔴',
      url: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      name: 'Telegram',
      icon: '✈️',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      color: 'bg-blue-500 hover:bg-blue-600'
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform: typeof platforms[0]) => {
    window.open(platform.url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
        📢 Share Your Results
      </h3>
      
      <p className="text-gray-600 mb-6 text-center">
        Let others know how your political views align and invite them to take the quiz!
      </p>

      {/* Social Platform Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {platforms.map((platform) => (
          <button
            key={platform.name}
            onClick={() => handleShare(platform)}
            className={`
              ${platform.color} text-white font-medium py-3 px-4 rounded-lg
              transition-all duration-200 hover:scale-105 
              flex items-center justify-center space-x-2
            `}
          >
            <span className="text-lg">{platform.icon}</span>
            <span className="text-sm">{platform.name}</span>
          </button>
        ))}
      </div>

      {/* Copy Link Section */}
      <div className="border-t pt-4">
        <p className="text-sm text-gray-600 mb-3 text-center">
          Or copy the link to share anywhere:
        </p>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
          />
          <button
            onClick={copyToClipboard}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${copied 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-white hover:scale-105'
              }
            `}
          >
            {copied ? '✅ Copied!' : '📋 Copy Link'}
          </button>
        </div>
      </div>

      {/* Share Text Preview */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500 mb-1">Preview of shared text:</p>
        <p className="text-sm text-gray-700 italic">
          &quot;{shareText}&quot;
        </p>
      </div>
    </div>
  );
}