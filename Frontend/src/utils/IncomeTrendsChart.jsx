import { Bar } from "react-chartjs-2";
// eslint-disable-next-line no-unused-vars
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
