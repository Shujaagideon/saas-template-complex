"use client"
import { redirect } from 'next/navigation';

const useAuthRedirect = () => {

  // In case the user signs out while on the page.
  // if (isLoaded && !userId) {
    redirect("/")
  // };
};

export default useAuthRedirect;