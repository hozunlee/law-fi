import { z } from "zod";

export const emailSchema = z.string().email("유효한 이메일을 입력해주세요.");
export const otpSchema = z.string().length(6, "6자리 숫자를 입력해주세요.");
