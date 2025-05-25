import React from 'react';

const ShippingPolicy = () => {
    const shippingMethods = [
        {
            name: "Standard Shipping",
            time: "3-5 business days",
            price: "Free on orders over $50",
            description: "Our standard shipping option is available for all orders. Orders are typically processed within 1-2 business days."
        },
        {
            name: "Express Shipping",
            time: "1-2 business days",
            price: "$15.99",
            description: "Get your order delivered quickly with our express shipping option. Orders placed before 2 PM EST will be processed the same day."
        },
        {
            name: "International Shipping",
            time: "7-14 business days",
            price: "Varies by location",
            description: "We ship to most countries worldwide. International shipping rates and delivery times vary by location."
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping Policy</h1>

            {/* Introduction */}
            <div className="prose prose-lg mb-12">
                <p className="text-gray-600">
                    At Forever.com, we strive to provide fast and reliable shipping services to all our customers. 
                    This policy outlines our shipping methods, delivery times, and related information.
                </p>
            </div>

            {/* Shipping Methods */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shipping Methods</h2>
                <div className="space-y-6">
                    {shippingMethods.map((method, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{method.name}</h3>
                                    <p className="text-gray-500">{method.time}</p>
                                </div>
                                <span className="text-indigo-600 font-medium">{method.price}</span>
                            </div>
                            <p className="text-gray-600">{method.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Important Information */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Important Information</h2>
                <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Order Processing</h3>
                        <p className="text-gray-600">
                            Orders are typically processed within 1-2 business days. Processing time may be longer during peak seasons or sales.
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Tracking Information</h3>
                        <p className="text-gray-600">
                            Once your order ships, you'll receive a tracking number via email. You can also track your order status in your account.
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">International Shipping</h3>
                        <p className="text-gray-600">
                            International orders may be subject to customs duties and taxes. These charges are the responsibility of the recipient.
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
                <p className="text-gray-600 mb-4">
                    If you have any questions about shipping or need assistance with your order, our customer service team is here to help.
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

export default ShippingPolicy; 