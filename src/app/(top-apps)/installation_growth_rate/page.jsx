import NavbarPage from '@/layouts/main/NavbarPage';
import TopInstallationGrowthRate from './_components/InstallationGrowthRate';
import { landingPage } from '@/seo/LandingPage';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}installation_growth_rate`,
  },
};

export default function InstallationGrowthRate() {
  return (
    <NavbarPage>
      <TopInstallationGrowthRate />
    </NavbarPage>
  );
}
