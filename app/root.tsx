import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";
import { StackedLayout } from "./components/StackedLayout";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <StackedLayout navbar={<Navbar></Navbar>} sidebar={<Sidebar></Sidebar>}>
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
