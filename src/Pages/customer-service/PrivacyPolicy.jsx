import React from 'react';

const PrivacyPolicy = () => {
    const sections = [
        {
            title: "Information We Collect",
            content: [
                "Personal information (name, email, address, phone number)",
                "Payment information (processed securely through our payment providers)",
                "Order history and preferences",
                "Device and browser information",
                "IP address and location data"
            ]
        },
        {
            title: "How We Use Your Information",
            content: [
                "Process and fulfill your orders",
                "Communicate about your orders and account",
                "Send marketing communications (with your consent)",
                "Improve our website and services",
                "Prevent fraud and enhance security"
            ]
        },
        {
            title: "Information Sharing",
            content: [
                "We do not sell your personal information",
                "Share with service providers (shipping, payment processing)",
                "Comply with legal obligations",
                "Protect our rights and prevent fraud"
            ]
        },
        {
            title: "Your Rights",
            content: [
                "Access your personal information",
                "Correct inaccurate data",
                "Request deletion of your data",
                "Opt-out of marketing communications",
                "Data portability"
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

            {/* Introduction */}
            <div className="prose prose-lg mb-12">
                <p className="text-gray-600">
                    At Forever.com, we take your privacy seriously. This Privacy Policy explains how we collect, 
                    use, and protect your personal information when you use our website and services.
                </p>
                <p className="text-gray-600 mt-4">
                    Last updated: {new Date().toLocaleDateString()}
                </p>
            </div>

            {/* Main Sections */}
            <div className="space-y-12">
                {sections.map((section, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                        <ul className="list-disc list-inside space-y-2">
                            {section.content.map((item, itemIndex) => (
                                <li key={itemIndex} className="text-gray-600">{item}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Cookies Section */}
            <div className="mt-12 bg-gray-50 rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking</h2>
                <p className="text-gray-600 mb-4">
                    We use cookies and similar tracking technologies to improve your browsing experience, 
                    analyze site traffic, and understand where our visitors are coming from.
                </p>
                <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-900">Types of Cookies We Use:</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>Essential cookies for site functionality</li>
                        <li>Analytics cookies to understand site usage</li>
                        <li>Marketing cookies for personalized content</li>
                        <li>Preference cookies to remember your settings</li>
                    </ul>
                </div>
            </div>

            {/* Security Section */}
            <div className="mt-12 bg-gray-50 rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Security</h2>
                <p className="text-gray-600">
                    We implement appropriate security measures to protect your personal information. 
                    However, no method of transmission over the Internet is 100% secure, and we cannot 
                    guarantee absolute security.
                </p>
            </div>

            {/* Contact Section */}
            <div className="mt-12 bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-600 mb-4">
                    If you have any questions about our Privacy Policy or how we handle your data, 
                    please contact our privacy team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <a
                        href="/contact"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Contact Privacy Team
                    </a>
                    <a
                        href="mailto:privacy@forever.com"
                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Email: privacy@forever.com
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy; 