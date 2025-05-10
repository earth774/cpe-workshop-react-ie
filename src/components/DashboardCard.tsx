import { ReactNode, useState } from "react";

interface DashboardCardProps {
  title: string;
  amount: number;
  icon: ReactNode;
  bgColor?: string;
  textColor?: string;
  trendPercentage?: number;
  trendLabel?: string;
  colorScheme?: "primary" | "success" | "danger" | "info" | "warning";
}

const DashboardCard = ({
  title,
  amount,
  icon,
  bgColor,
  textColor,
  trendPercentage,
  trendLabel = "จากเดือนที่แล้ว",
  colorScheme,
}: DashboardCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(value);
  };

  let cardStyle = {
    bgGradient: "",
    textMain: "",
    iconBg: "",
    borderColor: "",
    trendColor: "",
  };

  switch (colorScheme) {
    case "success":
      cardStyle = {
        bgGradient: "from-green-50 to-green-100",
        textMain: "text-green-700",
        iconBg: "bg-green-500/10",
        borderColor: "border-green-200",
        trendColor: "text-green-600",
      };
      break;
    case "danger":
      cardStyle = {
        bgGradient: "from-red-50 to-red-100",
        textMain: "text-red-700",
        iconBg: "bg-red-500/10",
        borderColor: "border-red-200",
        trendColor: "text-red-600",
      };
      break;
    case "info":
      cardStyle = {
        bgGradient: "from-blue-50 to-blue-100",
        textMain: "text-blue-700",
        iconBg: "bg-blue-500/10",
        borderColor: "border-blue-200",
        trendColor: "text-blue-600",
      };
      break;
    case "warning":
      cardStyle = {
        bgGradient: "from-yellow-50 to-yellow-100",
        textMain: "text-yellow-700",
        iconBg: "bg-yellow-500/10",
        borderColor: "border-yellow-200",
        trendColor: "text-yellow-600",
      };
      break;
    case "primary":
    default:
      cardStyle = {
        bgGradient: "from-primary-50 to-primary-100",
        textMain: "text-primary-700",
        iconBg: "bg-primary-500/10",
        borderColor: "border-primary-200",
        trendColor: "text-primary-600",
      };
  }

  const finalBgColor = bgColor || `bg-gradient-to-br ${cardStyle.bgGradient}`;
  const finalTextColor = textColor || cardStyle.textMain;

  return (
    <div
      className={`card p-6 relative overflow-hidden transition-all duration-300 border ${
        cardStyle.borderColor
      } shadow-sm hover:shadow-md ${finalBgColor} ${
        isHovered ? "translate-y-[-2px]" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${finalTextColor.replace(
          "text-",
          "bg-"
        )}`}
      ></div>

      <div className="flex items-center justify-between">
        <div className="z-10">
          <h3 className={`text-lg font-medium ${finalTextColor}`}>{title}</h3>
          <p className={`text-3xl font-bold mt-2 mb-1 ${finalTextColor}`}>
            {formatCurrency(amount)}
          </p>

          {trendPercentage !== undefined && (
            <div className="flex items-center mt-2 text-sm">
              <span
                className={`inline-flex items-center ${
                  trendPercentage >= 0 ? "text-green-600" : "text-red-600"
                } font-medium`}
              >
                {trendPercentage >= 0 ? (
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                    ></path>
                  </svg>
                )}
                {Math.abs(trendPercentage)}%
              </span>
              <span className="text-gray-500 ml-1">{trendLabel}</span>
            </div>
          )}
        </div>

        <div
          className={`text-3xl ${finalTextColor} p-3 rounded-full ${
            cardStyle.iconBg
          } transition-transform duration-300 ${isHovered ? "scale-110" : ""}`}
        >
          {icon}
        </div>
      </div>

      <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="120"
            cy="120"
            r="80"
            fill="currentColor"
            className={finalTextColor}
          />
          <path
            d="M120 120C120 103.431 106.569 90 90 90C73.431 90 60 103.431 60 120"
            stroke="currentColor"
            strokeWidth="4"
            className={finalTextColor}
          />
        </svg>
      </div>
    </div>
  );
};

export default DashboardCard;
