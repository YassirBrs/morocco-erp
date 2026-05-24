import { EnterpriseDepthFeaturePage, makeEnterpriseDepthServerSideProps } from '../../features/enterprise-depth/enterprise-depth-feature-page';

export const getServerSideProps = makeEnterpriseDepthServerSideProps('attendance');
export default EnterpriseDepthFeaturePage;
