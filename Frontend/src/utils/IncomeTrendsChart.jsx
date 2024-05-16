import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

// eslint-disable-next-line react/prop-types
const IncomeTrendsChart = ({ incomeData }) => {
  return (
    <>
      <Bar data={incomeData} />
    </>
  );
};

export default IncomeTrendsChart;
