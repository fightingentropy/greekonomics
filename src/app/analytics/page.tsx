'use client';

import { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PageAnalytics {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  avgTimeOnSite: number;
}

interface PageViewsByPath {
  path: string;
  views: number;
  percentage: number;
}

export default function AnalyticsPage() {
  const [timeSeriesData, setTimeSeriesData] = useState<PageAnalytics[]>([]);
  const [topPages, setTopPages] = useState<PageViewsByPath[]>([]);

  useEffect(() => {
    // Mock data - replace with actual analytics API calls
    const mockTimeSeriesData: PageAnalytics[] = [
      { date: '2024-01-21', pageViews: 1200, uniqueVisitors: 850, avgTimeOnSite: 125 },
      { date: '2024-01-22', pageViews: 1350, uniqueVisitors: 920, avgTimeOnSite: 130 },
      { date: '2024-01-23', pageViews: 1100, uniqueVisitors: 780, avgTimeOnSite: 128 },
      { date: '2024-01-24', pageViews: 1450, uniqueVisitors: 1020, avgTimeOnSite: 135 },
      { date: '2024-01-25', pageViews: 1600, uniqueVisitors: 1150, avgTimeOnSite: 140 },
      { date: '2024-01-26', pageViews: 1400, uniqueVisitors: 980, avgTimeOnSite: 132 },
      { date: '2024-01-27', pageViews: 1250, uniqueVisitors: 890, avgTimeOnSite: 129 },
    ];

    const mockTopPages: PageViewsByPath[] = [
      { path: '/markets', views: 4500, percentage: 28.5 },
      { path: '/news', views: 3800, percentage: 24.1 },
      { path: '/tweets', views: 3200, percentage: 20.3 },
      { path: '/', views: 2800, percentage: 17.7 },
      { path: '/articles', views: 1500, percentage: 9.4 },
    ];

    setTimeSeriesData(mockTimeSeriesData);
    setTopPages(mockTopPages);
  }, []);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Website Analytics</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Traffic Overview (Last 7 Days)</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pageViews" stroke="#8884d8" name="Page Views" />
                <Line type="monotone" dataKey="uniqueVisitors" stroke="#82ca9d" name="Unique Visitors" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[rgb(36,36,36)] p-4 rounded-lg">
                <h3 className="text-sm text-gray-400">Total Page Views</h3>
                <p className="text-2xl font-bold text-blue-500">15,800</p>
              </div>
              <div className="bg-[rgb(36,36,36)] p-4 rounded-lg">
                <h3 className="text-sm text-gray-400">Unique Visitors</h3>
                <p className="text-2xl font-bold text-green-500">6,590</p>
              </div>
              <div className="bg-[rgb(36,36,36)] p-4 rounded-lg">
                <h3 className="text-sm text-gray-400">Avg. Time on Site</h3>
                <p className="text-2xl font-bold text-purple-500">2m 15s</p>
              </div>
              <div className="bg-[rgb(36,36,36)] p-4 rounded-lg">
                <h3 className="text-sm text-gray-400">Bounce Rate</h3>
                <p className="text-2xl font-bold text-yellow-500">32.5%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Most Visited Pages</h2>
            <div className="space-y-4">
              {topPages.map((page) => (
                <div key={page.path} className="flex items-center justify-between p-3 bg-[rgb(36,36,36)] rounded-lg">
                  <div>
                    <p className="font-medium">{page.path}</p>
                    <p className="text-sm text-gray-400">{page.views.toLocaleString()} views</p>
                  </div>
                  <div className="text-blue-500 font-semibold">
                    {page.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
