import BingoBoard from "@/components/BingoBoard";

export default function Home() {
  return (
    <main className="">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-8">Bingo Simulator</h1>
        <BingoBoard />
      </main>
    </main>
  );
}
