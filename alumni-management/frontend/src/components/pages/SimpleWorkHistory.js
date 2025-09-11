import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SimpleWorkHistory = ({ userId, isOwnProfile = false }) => {
    const [workHistory, setWorkHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWorkHistory();
    }, [userId]);

    const fetchWorkHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = isOwnProfile 
                ? 'http://localhost:5000/api/work-history'
                : `http://localhost:5000/api/work-history/user/${userId}`;
            
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            
            const response = await axios.get(url, { headers });
            
            if (response.data.success) {
                setWorkHistory(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching work history:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short'
        });
    };

    const calculateDuration = (startDate, endDate, isCurrent) => {
        const start = new Date(startDate);
        const end = isCurrent ? new Date() : new Date(endDate);
        
        const diffTime = Math.abs(end - start);
        const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
        
        if (diffMonths < 12) {
            return `${diffMonths} เดือน`;
        } else {
            const years = Math.floor(diffMonths / 12);
            const months = diffMonths % 12;
            if (months === 0) {
                return `${years} ปี`;
            } else {
                return `${years} ปี ${months} เดือน`;
            }
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H8a2 2 0 00-2-2V6m8 0h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2" />
                    </svg>
                    ประวัติการทำงาน
                </h3>
                
                {isOwnProfile && (
                    <a 
                        href="/work-history" 
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        จัดการ →
                    </a>
                )}
            </div>

            {workHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H8a2 2 0 00-2-2V6m8 0h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2" />
                    </svg>
                    <p className="text-sm">ยังไม่มีประวัติการทำงาน</p>
                    {isOwnProfile && (
                        <a 
                            href="/work-history"
                            className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                            เพิ่มประวัติการทำงาน
                        </a>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {workHistory.slice(0, 3).map((item, index) => (
                        <div key={item.id} className="border-l-4 border-blue-500 pl-4 py-2">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-gray-800 text-sm">
                                            {item.position}
                                        </h4>
                                        {item.is_current && (
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                                                ปัจจุบัน
                                            </span>
                                        )}
                                    </div>
                                    
                                    <p className="text-blue-600 font-medium text-sm mb-1">
                                        {item.company_name}
                                    </p>
                                    
                                    <div className="text-xs text-gray-600 flex items-center gap-2">
                                        <span>
                                            {formatDate(item.start_date)} 
                                            {item.end_date && !item.is_current ? ` - ${formatDate(item.end_date)}` : ''}
                                            {item.is_current && ' - ปัจจุบัน'}
                                        </span>
                                        <span className="text-gray-400">•</span>
                                        <span>
                                            {calculateDuration(item.start_date, item.end_date, item.is_current)}
                                        </span>
                                        {item.location && (
                                            <>
                                                <span className="text-gray-400">•</span>
                                                <span>{item.location}</span>
                                            </>
                                        )}
                                    </div>

                                    {item.job_description && (
                                        <p className="text-xs text-gray-700 mt-2 line-clamp-2">
                                            {item.job_description.length > 100 
                                                ? `${item.job_description.substring(0, 100)}...`
                                                : item.job_description
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {workHistory.length > 3 && (
                        <div className="text-center pt-4 border-t">
                            <a 
                                href={isOwnProfile ? "/work-history" : `/profile/${userId}`}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                ดูประวัติการทำงานทั้งหมด ({workHistory.length} รายการ)
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SimpleWorkHistory;
