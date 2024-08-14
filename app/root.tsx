import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import "./tailwind.css";
import { StackedLayout } from "./components/StackedLayout";
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarSection,
} from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Avatar } from "./components/Avatar";
import { Link } from "./components/Link";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <StackedLayout
          navbar={
            <Navbar>
              <Link href="/">
                <Avatar className="size-10" src="/public/favicon.ico" />
              </Link>
              <NavbarDivider />
              <NavbarSection>
                <NavbarItem
                  className={
                    location.pathname.includes("webinars")
                      ? "border-b-2 border-gray-500"
                      : ""
                  }
                  href="/webinars"
                >
                  Webinars
                </NavbarItem>
              </NavbarSection>
            </Navbar>
          }
          sidebar={<Sidebar></Sidebar>}
        >
          {children}
        </StackedLayout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
