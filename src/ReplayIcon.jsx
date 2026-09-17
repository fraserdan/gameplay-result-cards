export default function ReplayIcon({ className, fill = "#185ABC" }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 4C11.79 4 11.58 4.02 11.38 4.04L13.21 2.21L11.8 0.8L7.59 5L11.8 9.21L13.21 7.8L11.46 6.05C11.64 6.03 11.81 6 12 6C15.86 6 19 9.14 19 13C19 16.86 15.86 20 12 20C8.14 20 5 16.86 5 13H3C3 17.97 7.03 22 12 22C16.97 22 21 17.97 21 13C21 8.03 16.97 4 12 4Z"
        fill={fill}
      />
    </svg>
  );
}
