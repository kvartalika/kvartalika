export const safeImage = (data: string[] | string | undefined, type: "layout" | 'flat' | 'history' | 'home') => {
  const safe = "fallback.png";
  if (Array.isArray(data) && data.length > 0) return data;
  else if (!Array.isArray(data) && data) return data;
  return safe;
}