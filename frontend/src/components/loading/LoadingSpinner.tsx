import ClipLoader from "react-spinners/ClipLoader";

const LoadingSpinner: React.FC = () => (
  <div className="section has-background-light">
    <div className="container">
      <div
        className="mt-6 mb-6"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ClipLoader color="#5fceb2" size={60} />
      </div>
    </div>
  </div>
);

export default LoadingSpinner;
