import NavbarPage from '@/layouts/main/NavbarPage';
import TopAppGrowthRate from './_components/GrowthRate';
import { landingPage } from '@/seo/LandingPage';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}growth_rate`,
  },
};

export default function GrowthRate() {
  return (
    <NavbarPage>
      <TopAppGrowthRate />
    </NavbarPage>
  );
}
