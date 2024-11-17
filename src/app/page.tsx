import { Discussion } from "./_components/discussion";
import { Config } from "./_components/config";

export default function Home() {
  return (
    <main className="h-screen overflow-hidden pt-16 px-4">
      <div className="max-w-screen-2xl mx-auto flex gap-5">
        <Discussion />
        <Config />
      </div>
    </main>
  );
}
