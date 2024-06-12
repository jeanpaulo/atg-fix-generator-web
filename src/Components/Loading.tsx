interface LoadingProps {
  isLoading: boolean;
}

const Loading = ({ isLoading }: LoadingProps) => {
  if (isLoading) {
    return (
      <>
        <div className="absolute inset-0 z-20 flex items-center justify-center w-screen h-screen text-violet-700 bg-[#4f4f4f88] ">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </>
    );
  }
};

export default Loading;
