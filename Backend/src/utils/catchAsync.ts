import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { errorConverter } from "../middleware/error.middleware";
import { ApiError } from "./ApiError";
