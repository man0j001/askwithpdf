import FileUpload from "@/components/ui/FileUpload";
import { UserButton } from "@clerk/nextjs"

export default async function Home() {
  return (
    <section className="w-full flex-center flex-col justify-center items-center mt-36">
    <h1 className="head_text text-center">Discover & Share
    <br className="md:hidden"/>
    <span className="orange_gradient text-center"> AI-Powered Prompts</span></h1>
    <p className="desc text-center">Promptopia is an open-source AI prompting tool for modern world to discover, create and share creative prompts</p>
    <FileUpload/>
</section>
  );
}
