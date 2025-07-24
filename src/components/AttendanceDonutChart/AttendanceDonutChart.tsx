import { PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#88B6A6', '#00091B']; // Зеленый и коралловый

type CenterTextProps = {
    attendedPercent: number;
};

type AttendanceDonutChartProps = {
    attendedDays: number;
    missedDays: number;
};

const CenterText = ({ attendedPercent }: CenterTextProps) => (
    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize={24} fontWeight="bold" fill="#88B6A6">
        {`${attendedPercent}%`}
    </text>
);
const AttendanceDonutChart = ({ attendedDays, missedDays }: AttendanceDonutChartProps) => {
    const total = attendedDays + missedDays;
    const attendedPercent = total === 0 ? 0 : Math.round((attendedDays / total) * 100);

    const data = [
        { name: 'Посетил', value: attendedDays },
        { name: 'Пропустил', value: missedDays },
    ];

    return (
        <div>
            <PieChart width={300} height={300}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    labelLine={false}
                    // label={renderCustomizedLabel}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                    <CenterText attendedPercent={attendedPercent} />
                </Pie>
                <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: 16, color: '#666' }}
                />
            </PieChart>
        </div>
    );
};
export default AttendanceDonutChart;
