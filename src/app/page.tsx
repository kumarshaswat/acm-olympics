import Image from "next/image";
import Login from "../app/login";


export default function Home() {
  return (
    <main className="w-full">
      <div className="flex flex-col w-full pt-20 justify-center items-center">
        <h1 className="text-bold text-3xl">Event Sign Up</h1>
        <Login />
      </div>
    </main>


  );
}