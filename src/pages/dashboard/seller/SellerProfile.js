import React from 'react';

const InfoCard = ({ title, children }) => (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-500 text-sm mb-2 tracking-wide uppercase">{title}</h3>
        <div className="text-gray-800 text-base">{children}</div>
    </div>
);

const SellerProfile = ({ profile, isComplete }) => {
    const factory = profile?.factories?.[0];
    const location = factory?.location;

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h2>
            
            {!isComplete && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded-md shadow" role="alert">
                    <p className="font-bold">Complete Your Profile</p>
                    <p>Please ensure you have added your factory details and at least one product to unlock all dashboard features.</p>
                </div>
            )}

            <div className="space-y-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-700 mb-3 border-b pb-2">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoCard title="Email Address">
                            <p>{profile?.email}</p>
                        </InfoCard>
                        <InfoCard title="Phone Number">
                            <p>{profile?.phone}</p>
                        </InfoCard>
                    </div>
                </div>

                {factory && (
                    <div>
                        <h3 className="text-xl font-bold text-gray-700 mb-3 border-b pb-2">Factory Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <InfoCard title="Factory Name">
                                <p>{factory.name}</p>
                            </InfoCard>
                             <InfoCard title="Factory Type">
                                <p className="capitalize">{factory.factory_type}</p>
                            </InfoCard>
                             <InfoCard title="Factory Contact">
                                <p>{factory.contact_number}</p>
                            </InfoCard>
                        </div>
                    </div>
                )}

                {location && (
                     <div>
                        <h3 className="text-xl font-bold text-gray-700 mb-3 border-b pb-2">Location</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoCard title="Address">
                                <p>{`${location.address_line1}${location.address_line2 ? `, ${location.address_line2}` : ''}`}</p>
                            </InfoCard>
                            <InfoCard title="City & State">
                                <p>{`${location.city}, ${location.state}`}</p>
                            </InfoCard>
                             <InfoCard title="Postal Code">
                                <p>{location.postal_code}</p>
                            </InfoCard>
                             <InfoCard title="Country">
                                <p>{location.country}</p>
                            </InfoCard>
                        </div>
                    </div>
                )}

                <div>
                    <h3 className="text-xl font-bold text-gray-700 mb-3 border-b pb-2">Products</h3>
                     <InfoCard title="Summary">
                        <p>{profile?.products?.length > 0 ? `${profile.products.length} products listed.` : 'No products listed yet.'}</p>
                    </InfoCard>
                </div>
            </div>
        </div>
    );
};

export default SellerProfile;
