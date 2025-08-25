// import { getUserFromToken } from "@/lib/utils/auth";

// export function useAuth() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const userData = getUserFromToken();
//         if (userData) {
//           setUser(userData);
//         } else {
//           setUser(null);
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   return { user, loading };
// }