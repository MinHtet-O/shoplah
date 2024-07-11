import ClipLoader from "react-spinners/ClipLoader";

const LoadingSpinner: React.FC = () => (
  <div
    className="mt-8"
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        marginTop: 60,
        height: 60,
      }}
    >
      <ClipLoader color="#5fceb2" size={60} />
    </div>
  </div>
);

export default LoadingSpinner;
