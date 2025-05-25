import React from 'react';

const ReturnPolicy = () => {
    const returnSteps = [
        {
            step: 1,
            title: "Initiate Return",
            description: "Log into your account and go to 'My Orders'. Select the order and items you wish to return, then follow the return process."
        },
        {
            step: 2,
            title: "Package Items",
            description: "Pack the items in their original packaging with all accessories and documentation. Include the return label and packing slip."
        },
        {
            step: 3,
            title: "Ship Back",
            description: "Drop off the package at your nearest shipping location or schedule a pickup. Keep the tracking number for reference."
        },
        {
            step: 4,
            title: "Receive Refund",
            description: "Once we receive and inspect your return, we'll process your refund within 5-7 business days."
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Return Policy</h1>

            {/* Introduction */}
            <div className="prose prose-lg mb-12">
                <p className="text-gray-600">
                    We want you to be completely satisfied with your purchase. If you&apos;re not happy with your order, 
                    we&apos;re here to help with our hassle-free return process.
                </p>
            </div>

            {/* Return Process */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Return Process</h2>
                <div className="space-y-6">
                    {returnSteps.map((step) => (
                        <div key={step.step} className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-600 text-white">
                                        {step.step}
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                                    <p className="mt-2 text-gray-600">{step.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Important Information */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Important Information</h2>
                <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Return Window</h3>
                        <p className="text-gray-600">
                            You have 30 days from the delivery date to initiate a return. Items must be unused and in their original packaging.
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Return Shipping</h3>
                        <p className="text-gray-600">
                            Return shipping is free for items that arrived damaged or defective. For other returns, shipping costs may apply.
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Refund Process</h3>
                        <p className="text-gray-600">
                            Refunds are processed to the original payment method within 5-7 business days after we receive your return.
                        </p>
                    </div>
                </div>
            </div>

            {/* Exceptions */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Exceptions</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>Final sale items cannot be returned</li>
                        <li>Personalized or custom-made items are not eligible for return</li>
                        <li>Items must be in original condition with all tags and packaging</li>
                        <li>Used or damaged items may be subject to a restocking fee</li>
                    </ul>
                </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
                <p className="text-gray-600 mb-4">
                    If you have any questions about returns or need assistance with your return, our customer service team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <a
                        href="/contact"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Contact Us
                    </a>
                    <a
                        href="tel:+15551234567"
                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Call Us: +1 (555) 123-4567
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ReturnPolicy; 