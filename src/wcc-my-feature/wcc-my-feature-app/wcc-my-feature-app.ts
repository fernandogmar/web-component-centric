
//import "./wcc-my-feature-whatever.stories"; // FORBIDDEN

import '@/other-my-feature/other-my-feature-shared/other.helper'; // ALLOWED
import '@/other-my-feature/other-my-feature-super'; // ALLOWED
import '@/other-my-feature/other-my-feature-app'; // FORBIDDEN
import '@/other/other-component'; // ALLOWED
import '@/wcc-my-feature/wcc-my-feature-other'; // ALLOWED
import '@/wcc-my-feature/wcc-my-feature-other/wcc-my-feature-other'; // FORBIDDEN
import '@/wcc-my-feature/wcc-my-feature-shared/mocks/super.controller'; // ALLOWED
import '@/wcc/wcc-my-component'; // ALLOWED
import '@/wcc/wcc-shared/controllers/super.controller'; // ALLOWED
