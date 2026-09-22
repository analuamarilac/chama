import { createFileRoute } from "@tanstack/react-router";
import HomePage from "#/presentation/flows/home/pages/HomePage";

export const Route = createFileRoute("/")({ component: HomePage });
