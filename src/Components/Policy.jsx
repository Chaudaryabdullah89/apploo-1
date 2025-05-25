import React from 'react'
import assets from '../assets/assets'

const Policy = () => {
  const policies = [
    {
      id: 1,
      icon: assets.exchange_icon,
      title: 'Easy Exchange Policy',
      description: 'We offer hassle-free exchange policy for all our products',
      features: ['30-day exchange window', 'Free return shipping', 'Multiple size options']
    },
    {
      id: 2,
      icon: assets.quality_icon,
      title: '7 Days Return',
      description: 'We provide 7 days free return policy for your convenience',
      features: ['No questions asked', 'Full refund guarantee', 'Quick processing']
    },
    {
      id: 3,
      icon: assets.support_img,
      title: 'Best Customer Support',
      description: 'We provide 24/7 customer support to assist you',
      features: ['Live chat support', 'Email support', 'Phone support']
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {policies.map((policy) => (
            <div
              key={policy.id}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 mb-6 flex items-center justify-center">
                  <img
                    src={policy.icon}
                    alt={policy.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {policy.title}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {policy.description}
                </p>

                <ul className="space-y-2 text-left w-full">
                  {policy.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Policy