export const safeImage = (data: string[] | string | undefined, type: "layout" | 'flat' | 'history' | 'home') => {
  let safe;

  switch (type) {
    case 'layout':
      safe = '/imagesFallback/layout-test.png';
      break;
    case 'history':
      safe = '/imagesFallback/history.png';
      break;
    case 'flat':
      safe = '/imagesFallback/flat.jpg';
      break;
    case 'home':
      safe = '/imagesFallback/home.png';
      break;
  }
  if (Array.isArray(data) && data.length > 0) return data;
  else if (!Array.isArray(data) && data) return data;
  return safe;
}