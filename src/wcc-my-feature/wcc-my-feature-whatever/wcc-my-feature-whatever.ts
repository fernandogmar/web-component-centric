
import '../wcc-my-feature-other';// ALLOWED
//import '../wcc-my-feature-other/wcc-my-feature-other';// FORBIDDEN
import '../wcc-my-feature-shared/mocks/super.controller';// ALLOWED

import '../../wcc/wcc-my-component';// ALLOWED
import '../../wcc/wcc-shared/controllers/super.controller';// ALLOWED

import '../../other/other-component';// ALLOWED
//import '../../other-my-feature/other-my-feature-super'; // FORBIDDEN
//import '../../other-my-feature/other-my-feature-shared/other.helper'; // FORBIDDEN

import "./wcc-my-feature-whatever.stories"; // FORBIDDEN
