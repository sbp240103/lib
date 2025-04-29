interface StatCardProps {
  icon: string;
  iconColor: string;
  bgColor: string;
  value: number;
  label: string;
}

export default function StatCard({ icon, iconColor, bgColor, value, label }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
      <div className={`rounded-full ${bgColor} p-4 mr-4`}>
        <i className={`fas ${icon} ${iconColor} text-xl`}></i>
      </div>
      <div>
        <h3 className="font-semibold text-slate-700">{value}</h3>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}
