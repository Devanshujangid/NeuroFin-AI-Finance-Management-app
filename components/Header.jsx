import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { BrainCircuit, LogIn } from "lucide-react";
import { LayoutGrid, PenSquare } from "lucide-react";


const Header = () => {
  return (
    <header className="flex items-center justify-between px-3 sm:px-6 h-16 border-b">
      
      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="bg-blue-600 p-1.5 rounded-lg transition-transform group-hover:scale-110">
          <BrainCircuit className="w-6 h-6 text-white" />
        </div>

        <div className="flex flex-col">
          <span className="text-lg sm:text-xl font-bold tracking-tighter text-slate-900 leading-none">
            NEURO<span className="text-blue-600">FIN</span>
          </span>
          <span className="hidden sm:block text-[10px] font-medium text-slate-500 tracking-[0.2em] uppercase mt-1">
            Track • Save • Grow
          </span>
        </div>
      </Link>


      {/* Right: Auth / User */}
      <div className="flex items-center gap-3">
        <SignedOut>
          {/* Mobile: icon-only Sign In */}
          <SignInButton>
            <Button size="icon" className="sm:hidden">
              <LogIn className="h-4 w-4" />
            </Button>
          </SignInButton>

          {/* Desktop: text buttons */}
          <SignInButton>
            <Button
              size="sm"
              variant="secondary"
              className="hidden sm:inline-flex"
            >
              Sign In
            </Button>
          </SignInButton>

          <SignUpButton>
            <Button className="hidden sm:inline-flex">
              Sign Up
            </Button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
         <div className="flex items-center gap-2">
    
           {/* Dashboard button */}
           <Link href="/dashboard">
           <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
             <LayoutGrid className="h-4 w-4" />
             <span className="hidden sm:inline">Dashboard</span>
          </Button>
           </Link>

    {/* Add Transaction button */}
          <Link href="/transactions/new">
          <Button
            size="sm"
           className="flex items-center gap-2"
          >
          <PenSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Add Transaction</span>
         </Button>
         </Link>

      {/* User menu */}
      {/* to increase this user button size I will use the clerk property of avatar box...I will use appearance property of clerk */}
      <UserButton 
        appearance={ {
           elements: {
            avatarBox: "h-15 w-15",
           }
         }
        }/>      
      </div>
        </SignedIn>

      </div>
    </header>
  );
};

export default Header;
