'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    TrendingUp,
    Users,
    MessageCircle,
    Share2,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    Calendar as CalendarIcon,
    Sparkles
} from 'lucide-react';

const MOCK_BAR_DATA = [
    { platform: 'LinkedIn', posts: 12 },
    { platform: 'Twitter', posts: 18 },
    { platform: 'Facebook', posts: 5 },
    { platform: 'Instagram', posts: 8 },
    { platform: 'TikTok', posts: 4 },
];

const MOCK_LINE_DATA = [
    { name: 'Mon', engagement: 400 },
    { name: 'Tue', engagement: 300 },
    { name: 'Wed', engagement: 600 },
    { name: 'Thu', engagement: 800 },
    { name: 'Fri', engagement: 500 },
    { name: 'Sat', engagement: 900 },
    { name: 'Sun', engagement: 700 },
];

const MOCK_PIE_DATA = [
    { name: 'LinkedIn', value: 45 },
    { name: 'Twitter', value: 35 },
    { name: 'Other', value: 20 },
];

const COLORS = ['#2563eb', '#06b6d4', '#f1f5f9'];

export default function AnalyticsPage() {
    const stats = [
        { label: 'Total Posts', value: '47', icon: Share2, trend: '+12%', positive: true },
        { label: 'Avg. Engagement', value: '8.4%', icon: TrendingUp, trend: '+2.1%', positive: true },
        { label: 'Total Reach', value: '12.5k', icon: Users, trend: '-3%', positive: false },
        { label: 'Saved Drafts', value: '15', icon: MessageCircle, trend: '+5', positive: true },
    ];

    return (
        <div className="py-2">
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                    <BarChart3 size={12} strokeWidth={3} /> Performance Hub
                </div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Analytics</h1>
                <p className="text-gray-500 font-medium">Track your growth and content performance across all platforms.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                <stat.icon size={20} />
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black ${stat.positive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {stat.trend}
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Engagement Trend */}
                <div className="bg-white p-8 sm:p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <p className="text-sm font-black text-gray-900 flex items-center gap-2">
                            <TrendingUp size={18} className="text-blue-600" /> Engagement Trend
                        </p>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100 italic">Last 7 Days</span>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={MOCK_LINE_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                    dy={10}
                                />
                                <YAxis hide />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="engagement"
                                    stroke="#2563eb"
                                    strokeWidth={4}
                                    dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Posts per Platform */}
                <div className="bg-white p-8 sm:p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <p className="text-sm font-black text-gray-900 flex items-center gap-2">
                            <Share2 size={18} className="text-blue-600" /> Posts per Platform
                        </p>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100 italic">Distribution</span>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MOCK_BAR_DATA}>
                                <XAxis
                                    dataKey="platform"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                    dy={10}
                                />
                                <YAxis hide />
                                <RechartsTooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="posts" fill="#06b6d4" radius={[10, 10, 10, 10]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                    <p className="text-sm font-black text-gray-900 mb-8 flex items-center gap-2">
                        <CalendarIcon size={18} className="text-blue-600" /> Topic Saturation
                    </p>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={MOCK_PIE_DATA}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {MOCK_PIE_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 space-y-3">
                        {MOCK_PIE_DATA.map((item, i) => (
                            <div key={item.name} className="flex justify-between items-center text-xs font-bold">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                    <span className="text-gray-500">{item.name}</span>
                                </div>
                                <span className="text-gray-900 font-black">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-[#1e293b] p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles size={120} className="text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4 relative z-10">AI Optimization Insight</h3>
                    <p className="text-blue-100/70 text-sm leading-relaxed mb-10 max-w-md relative z-10">
                        Based on your recent content, your audience on <span className="text-blue-400 font-black">LinkedIn</span> is most active between <span className="text-white font-black">8:00 AM and 10:00 AM</span>.
                        Try generating some motivational topics for Tuesday mornings.
                    </p>
                    <button className="px-8 py-4 bg-blue-600 text-white text-xs font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 relative z-10">
                        Apply Optimization
                    </button>
                </div>
            </div>
        </div>
    );
}
