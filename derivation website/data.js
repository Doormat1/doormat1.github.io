// Video Quiz Data
// Update this with your YouTube playlist videos from:
// https://www.youtube.com/playlist?list=PLeNNmv3c0tyOeanB6GOiG7cWkdExMlCxN

// Video Quiz Data
// WJEC A Level Physics Derivations
// Playlist: https://www.youtube.com/playlist?list=PLeNNmv3c0tyOeanB6GOiG7cWkdExMlCxN

const videos = [
    {
        id: 1,
        title: "Derive XUVAT Equations",
        youtubeId: "rLrkhN2EyEw",
        description: "A step-by-step derivation of the XUVAT (SUVAT) kinematic equations used in A Level Physics and Maths, built up from the definition of acceleration and the area under a velocity–time graph.",
        quiz: {
            questions: [
                {
                    question: "The equation v = u + at is derived directly from which definition?",
                    options: [
                        { text: "Acceleration is defined as the rate of change of velocity: a = (v − u) / t", isCorrect: true },
                        { text: "Acceleration is defined as the rate of change of displacement", isCorrect: false },
                        { text: "Newton's second law: F = ma", isCorrect: false },
                        { text: "The area under a velocity–time graph", isCorrect: false }
                    ]
                },
                {
                    question: "The displacement x = ½(u + v)t is found from the area under a velocity–time graph. What shape is that area for uniform acceleration?",
                    options: [
                        { text: "Triangle", isCorrect: false },
                        { text: "Rectangle", isCorrect: false },
                        { text: "Trapezium", isCorrect: true },
                        { text: "Parallelogram", isCorrect: false }
                    ]
                },
                {
                    question: "To derive x = ut + ½at², which substitution is made into x = ½(u + v)t?",
                    options: [
                        { text: "u = v − at", isCorrect: false },
                        { text: "v = u + at", isCorrect: true },
                        { text: "a = v / t", isCorrect: false },
                        { text: "x = v² / 2a", isCorrect: false }
                    ]
                },
                {
                    question: "The equation v² = u² + 2ax is derived by eliminating which variable from two other XUVAT equations?",
                    options: [
                        { text: "Acceleration a", isCorrect: false },
                        { text: "Initial velocity u", isCorrect: false },
                        { text: "Displacement x", isCorrect: false },
                        { text: "Time t", isCorrect: true }
                    ]
                },
                {
                    question: "Which XUVAT equation is most useful when the initial velocity u is unknown?",
                    options: [
                        { text: "v = u + at", isCorrect: false },
                        { text: "x = ut + ½at²", isCorrect: false },
                        { text: "v² = u² + 2ax", isCorrect: false },
                        { text: "x = vt − ½at²", isCorrect: true }
                    ]
                }
            ]
        }
    },
    {
        id: 2,
        title: "Snell's Law and Critical Angle",
        youtubeId: "DLqyT1rt2ys",
        description: "Derives Snell's law (n₁sinθ₁ = n₂sinθ₂) from the behaviour of light at a boundary, and uses it to derive the formula for the critical angle of a medium.",
        quiz: {
            questions: [
                {
                    question: "The refractive index n of a medium is defined as:",
                    options: [
                        { text: "n = v / c (speed in medium / speed in vacuum)", isCorrect: false },
                        { text: "n = c / v (speed of light in vacuum / speed in medium)", isCorrect: true },
                        { text: "n = sinθ₁ / sinθ₂", isCorrect: false },
                        { text: "n = wavelength in vacuum / wavelength in medium", isCorrect: false }
                    ]
                },
                {
                    question: "Snell's law states n₁sinθ₁ = n₂sinθ₂. What do θ₁ and θ₂ represent?",
                    options: [
                        { text: "The angles of incidence and reflection", isCorrect: false },
                        { text: "The angles of incidence and refraction, measured from the normal", isCorrect: true },
                        { text: "The angles measured from the boundary surface", isCorrect: false },
                        { text: "The critical angle in each medium", isCorrect: false }
                    ]
                },
                {
                    question: "The critical angle formula is derived by setting θ₂ equal to:",
                    options: [
                        { text: "0°", isCorrect: false },
                        { text: "45°", isCorrect: false },
                        { text: "90°", isCorrect: true },
                        { text: "θ₁", isCorrect: false }
                    ]
                },
                {
                    question: "For light travelling from glass (n = 1.5) into air (n = 1.0), the critical angle θ_c satisfies:",
                    options: [
                        { text: "sin θ_c = 1.5", isCorrect: false },
                        { text: "sin θ_c = 1.0 / 1.5 ≈ 0.667", isCorrect: true },
                        { text: "sin θ_c = 1.5 − 1.0", isCorrect: false },
                        { text: "sin θ_c = 1.0", isCorrect: false }
                    ]
                },
                {
                    question: "Total internal reflection can only occur when light travels:",
                    options: [
                        { text: "From a less dense to a more optically dense medium", isCorrect: false },
                        { text: "From a more optically dense to a less optically dense medium, at or beyond the critical angle", isCorrect: true },
                        { text: "Along the normal at any angle", isCorrect: false },
                        { text: "From air into glass at any angle", isCorrect: false }
                    ]
                }
            ]
        }
    },
    {
        id: 3,
        title: "Diffraction Grating",
        youtubeId: "nxu2a1CPx1Y",
        description: "Derives the diffraction grating equation d sinθ = nλ from the condition for constructive interference between waves passing through adjacent slits.",
        quiz: {
            questions: [
                {
                    question: "In the diffraction grating equation d sinθ = nλ, what does d represent?",
                    options: [
                        { text: "The width of each individual slit", isCorrect: false },
                        { text: "The slit separation — the distance between adjacent slits", isCorrect: true },
                        { text: "The total width of the grating", isCorrect: false },
                        { text: "The depth of the grating", isCorrect: false }
                    ]
                },
                {
                    question: "Constructive interference at a diffraction grating occurs when the path difference between waves from adjacent slits equals:",
                    options: [
                        { text: "Half a wavelength (λ/2)", isCorrect: false },
                        { text: "A quarter wavelength (λ/4)", isCorrect: false },
                        { text: "A whole number of wavelengths (nλ)", isCorrect: true },
                        { text: "Zero", isCorrect: false }
                    ]
                },
                {
                    question: "A diffraction grating has 400 lines per mm. What is the slit separation d?",
                    options: [
                        { text: "400 × 10⁻³ m", isCorrect: false },
                        { text: "2.5 × 10⁻³ m", isCorrect: false },
                        { text: "2.5 × 10⁻⁶ m", isCorrect: true },
                        { text: "4.0 × 10⁻⁴ m", isCorrect: false }
                    ]
                },
                {
                    question: "What is the maximum possible order n for a given grating spacing d and wavelength λ?",
                    options: [
                        { text: "n can be any positive integer with no limit", isCorrect: false },
                        { text: "n = 1 always", isCorrect: false },
                        { text: "The largest whole number satisfying nλ ≤ d, since sinθ cannot exceed 1", isCorrect: true },
                        { text: "n = d × λ", isCorrect: false }
                    ]
                },
                {
                    question: "Compared to a double slit, a diffraction grating with many slits produces maxima that are:",
                    options: [
                        { text: "Broader and dimmer", isCorrect: false },
                        { text: "Narrower and brighter", isCorrect: true },
                        { text: "The same width but brighter", isCorrect: false },
                        { text: "Broader and brighter", isCorrect: false }
                    ]
                }
            ]
        }
    },
    {
        id: 4,
        title: "SHM for Springs and Pendulums",
        youtubeId: "lgQphSPPAhI",
        description: "Derives the period equations for a mass-spring system (T = 2π√(m/k)) and a simple pendulum (T = 2π√(L/g)) by applying Newton's second law and the condition for SHM.",
        quiz: {
            questions: [
                {
                    question: "For a mass on a spring, applying Newton's 2nd law gives ma = −kx. Comparing with a = −ω²x, what is ω?",
                    options: [
                        { text: "ω = k / m", isCorrect: false },
                        { text: "ω = √(k / m)", isCorrect: true },
                        { text: "ω = √(m / k)", isCorrect: false },
                        { text: "ω = m / k", isCorrect: false }
                    ]
                },
                {
                    question: "The period of a mass-spring system is T = 2π√(m/k). If the spring constant k is doubled (with m unchanged), the period:",
                    options: [
                        { text: "Doubles", isCorrect: false },
                        { text: "Halves", isCorrect: false },
                        { text: "Decreases by a factor of √2", isCorrect: true },
                        { text: "Stays the same", isCorrect: false }
                    ]
                },
                {
                    question: "For a simple pendulum, the small angle approximation sinθ ≈ θ is used. This approximation makes the restoring force proportional to:",
                    options: [
                        { text: "The square of displacement", isCorrect: false },
                        { text: "Displacement (giving SHM)", isCorrect: true },
                        { text: "The velocity of the bob", isCorrect: false },
                        { text: "The mass of the bob", isCorrect: false }
                    ]
                },
                {
                    question: "The period of a simple pendulum T = 2π√(L/g) is independent of:",
                    options: [
                        { text: "The length L of the pendulum", isCorrect: false },
                        { text: "The gravitational field strength g", isCorrect: false },
                        { text: "The mass of the bob", isCorrect: true },
                        { text: "Both L and g", isCorrect: false }
                    ]
                },
                {
                    question: "The small angle approximation used in the pendulum derivation is valid for angles roughly up to:",
                    options: [
                        { text: "5° to 10°", isCorrect: true },
                        { text: "45°", isCorrect: false },
                        { text: "90°", isCorrect: false },
                        { text: "30°", isCorrect: false }
                    ]
                }
            ]
        }
    },
    {
        id: 5,
        title: "Internal Energy of an Ideal Gas",
        youtubeId: "sK6oE2_f71g",
        description: "Shows how to combine the ideal gas equation (pV = nRT) with the kinetic theory equation (pV = ⅓Nmc²) to derive U = 3/2 nRT and its equivalents for the internal energy of an ideal gas.",
        quiz: {
            questions: [
                {
                    question: "The internal energy formula U = 3/2 nRT is derived by combining which two equations?",
                    options: [
                        { text: "F = ma and pV = nRT", isCorrect: false },
                        { text: "pV = nRT and pV = ⅓Nmc²", isCorrect: true },
                        { text: "E = mc² and pV = nRT", isCorrect: false },
                        { text: "U = Q + W and pV = nRT", isCorrect: false }
                    ]
                },
                {
                    question: "In U = 3/2 nRT, the factor 3/2 arises because:",
                    options: [
                        { text: "There are 3 spatial dimensions, each contributing ½kT of kinetic energy per molecule", isCorrect: true },
                        { text: "It is a mathematical constant with no physical meaning", isCorrect: false },
                        { text: "Each molecule has 3 atoms", isCorrect: false },
                        { text: "The gas constant R equals 3/2 times Boltzmann's constant", isCorrect: false }
                    ]
                },
                {
                    question: "The mean kinetic energy of a single molecule of an ideal gas is:",
                    options: [
                        { text: "½mc² = kT", isCorrect: false },
                        { text: "½mc² = 3/2 kT", isCorrect: true },
                        { text: "½mc² = nRT", isCorrect: false },
                        { text: "½mc² = 3/2 RT", isCorrect: false }
                    ]
                },
                {
                    question: "For an ideal gas, internal energy U depends only on:",
                    options: [
                        { text: "Pressure and volume only", isCorrect: false },
                        { text: "Volume only", isCorrect: false },
                        { text: "Temperature only", isCorrect: true },
                        { text: "Both pressure and temperature", isCorrect: false }
                    ]
                },
                {
                    question: "Which of these is an equivalent expression for internal energy using the Boltzmann constant k and total number of molecules N?",
                    options: [
                        { text: "U = 3/2 NkT", isCorrect: true },
                        { text: "U = 3/2 nkT", isCorrect: false },
                        { text: "U = 3NkT", isCorrect: false },
                        { text: "U = NkT", isCorrect: false }
                    ]
                }
            ]
        }
    },
    {
        id: 6,
        title: "Half-Life",
        youtubeId: "4Y2diL9sABM",
        description: "Derives the radioactive decay equation N = N₀e^(−λt) from the decay differential equation dN/dt = −λN, and shows how the half-life T½ = ln2/λ follows from this.",
        quiz: {
            questions: [
                {
                    question: "The differential equation for radioactive decay is dN/dt = −λN. What does the negative sign indicate?",
                    options: [
                        { text: "The decay constant λ is negative", isCorrect: false },
                        { text: "The number of undecayed nuclei is decreasing over time", isCorrect: true },
                        { text: "Nuclei are being created", isCorrect: false },
                        { text: "Activity increases over time", isCorrect: false }
                    ]
                },
                {
                    question: "Solving dN/dt = −λN by separating variables and integrating gives:",
                    options: [
                        { text: "N = N₀ − λt", isCorrect: false },
                        { text: "N = N₀ / λt", isCorrect: false },
                        { text: "N = N₀e^(−λt)", isCorrect: true },
                        { text: "N = λN₀t", isCorrect: false }
                    ]
                },
                {
                    question: "The half-life T½ is derived by setting N = N₀/2. The result is:",
                    options: [
                        { text: "T½ = 1 / λ", isCorrect: false },
                        { text: "T½ = λ / ln2", isCorrect: false },
                        { text: "T½ = ln2 / λ", isCorrect: true },
                        { text: "T½ = λ", isCorrect: false }
                    ]
                },
                {
                    question: "Activity A = λN. Starting from A₀ = λN₀, how does activity change over time?",
                    options: [
                        { text: "A stays constant", isCorrect: false },
                        { text: "A decreases linearly: A = A₀ − λt", isCorrect: false },
                        { text: "A = A₀e^(−λt) — it decays exponentially with the same half-life as N", isCorrect: true },
                        { text: "A increases exponentially", isCorrect: false }
                    ]
                },
                {
                    question: "A student plots ln(A) against time t to find the decay constant. What does the gradient of the straight line equal?",
                    options: [
                        { text: "+λ", isCorrect: false },
                        { text: "−λ", isCorrect: true },
                        { text: "ln2 / λ", isCorrect: false },
                        { text: "1 / λ", isCorrect: false }
                    ]
                }
            ]
        }
    },
    {
        id: 7,
        title: "Capacitors in Series and Parallel",
        youtubeId: "hJUddR07UKg",
        description: "Derives the formulae for combined capacitance when capacitors are connected in parallel (C_total = C₁ + C₂) and in series (1/C_total = 1/C₁ + 1/C₂) from the definitions of capacitance and charge.",
        quiz: {
            questions: [
                {
                    question: "For capacitors in parallel, the total capacitance C_total = C₁ + C₂. This is because:",
                    options: [
                        { text: "The voltage across each is the same and total charge adds: Q_total = Q₁ + Q₂", isCorrect: true },
                        { text: "The charge on each is the same and voltages add", isCorrect: false },
                        { text: "Capacitors in parallel always have less capacitance", isCorrect: false },
                        { text: "The electric fields from each capacitor add directly", isCorrect: false }
                    ]
                },
                {
                    question: "For capacitors in series, 1/C_total = 1/C₁ + 1/C₂. This is because:",
                    options: [
                        { text: "The voltage is the same across each and charges add", isCorrect: false },
                        { text: "The same charge Q is on each capacitor and the voltages add: V_total = V₁ + V₂", isCorrect: true },
                        { text: "Series capacitors always have more capacitance", isCorrect: false },
                        { text: "Current is shared equally between them", isCorrect: false }
                    ]
                },
                {
                    question: "Two identical capacitors, each of capacitance C, are connected in parallel. The total capacitance is:",
                    options: [
                        { text: "C / 2", isCorrect: false },
                        { text: "C", isCorrect: false },
                        { text: "2C", isCorrect: true },
                        { text: "C²", isCorrect: false }
                    ]
                },
                {
                    question: "Two identical capacitors, each of capacitance C, are connected in series. The total capacitance is:",
                    options: [
                        { text: "2C", isCorrect: false },
                        { text: "C", isCorrect: false },
                        { text: "C / 2", isCorrect: true },
                        { text: "C²", isCorrect: false }
                    ]
                },
                {
                    question: "In a series capacitor circuit, why does the same charge Q appear on each capacitor?",
                    options: [
                        { text: "They are connected to the same voltage source", isCorrect: false },
                        { text: "The conductor between adjacent capacitors is isolated — charge on one plate induces equal charge on the next", isCorrect: true },
                        { text: "They have the same capacitance value", isCorrect: false },
                        { text: "Current flows freely and distributes charge equally", isCorrect: false }
                    ]
                }
            ]
        }
    },
    {
        id: 8,
        title: "Kepler's 3 Laws",
        youtubeId: "2m54j5euRic",
        description: "Covers all three of Kepler's laws of planetary motion, with a full derivation of the third law (T² ∝ r³) by equating gravitational force to centripetal force.",
        quiz: {
            questions: [
                {
                    question: "Kepler's 1st law states that planetary orbits are:",
                    options: [
                        { text: "Perfect circles with the Sun at the centre", isCorrect: false },
                        { text: "Ellipses with the Sun at one focus", isCorrect: true },
                        { text: "Parabolas", isCorrect: false },
                        { text: "Circles with the Sun at the edge", isCorrect: false }
                    ]
                },
                {
                    question: "Kepler's 2nd law (equal areas in equal times) is a consequence of conservation of:",
                    options: [
                        { text: "Linear momentum", isCorrect: false },
                        { text: "Kinetic energy", isCorrect: false },
                        { text: "Angular momentum", isCorrect: true },
                        { text: "Total mechanical energy", isCorrect: false }
                    ]
                },
                {
                    question: "Kepler's 3rd law T² ∝ r³ is derived by equating gravitational force to centripetal force and substituting v = 2πr/T. The result is:",
                    options: [
                        { text: "T² = (GM / 4π²)r³", isCorrect: false },
                        { text: "T² = (4π² / GM)r³", isCorrect: true },
                        { text: "T² = GMr", isCorrect: false },
                        { text: "T = (2π / GM)r²", isCorrect: false }
                    ]
                },
                {
                    question: "In T² = (4π²/GM)r³, the planet's mass m cancels out. This means the orbital period depends on:",
                    options: [
                        { text: "The planet's mass and radius only", isCorrect: false },
                        { text: "The orbital radius r and the central mass M (the Sun) only", isCorrect: true },
                        { text: "The planet's mass and orbital radius only", isCorrect: false },
                        { text: "Only the orbital radius r", isCorrect: false }
                    ]
                },
                {
                    question: "Planet A has an orbital radius twice that of planet B. How many times longer is planet A's orbital period compared to planet B's?",
                    options: [
                        { text: "2 times longer", isCorrect: false },
                        { text: "4 times longer", isCorrect: false },
                        { text: "2√2 times longer", isCorrect: true },
                        { text: "8 times longer", isCorrect: false }
                    ]
                }
            ]
        }
    },
    {
        id: 9,
        title: "Hubble's Law and Age of the Universe",
        youtubeId: "oaVM4wFTtRY",
        description: "Shows how Hubble's law (v = H₀d) can be used to estimate the age of the universe as t ≈ 1/H₀, by assuming galaxies have moved at constant speed since the Big Bang.",
        quiz: {
            questions: [
                {
                    question: "Hubble's law states v = H₀d. What do v and d represent?",
                    options: [
                        { text: "v = volume of galaxy, d = diameter", isCorrect: false },
                        { text: "v = recession speed of the galaxy, d = its distance from us", isCorrect: true },
                        { text: "v = speed of light, d = redshift", isCorrect: false },
                        { text: "v = frequency shift, d = density", isCorrect: false }
                    ]
                },
                {
                    question: "Assuming a galaxy has moved at constant speed since the Big Bang, the estimated age of the universe is:",
                    options: [
                        { text: "t = H₀d", isCorrect: false },
                        { text: "t = H₀ / d", isCorrect: false },
                        { text: "t = 1 / H₀", isCorrect: true },
                        { text: "t = d / H₀²", isCorrect: false }
                    ]
                },
                {
                    question: "Using H₀ ≈ 2.2 × 10⁻¹⁸ s⁻¹, the estimated age of the universe 1/H₀ is approximately:",
                    options: [
                        { text: "14 million years", isCorrect: false },
                        { text: "14 billion years", isCorrect: true },
                        { text: "140 billion years", isCorrect: false },
                        { text: "1.4 billion years", isCorrect: false }
                    ]
                },
                {
                    question: "Hubble measured the recession speeds of galaxies using:",
                    options: [
                        { text: "Parallax measurements", isCorrect: false },
                        { text: "The redshift of spectral lines", isCorrect: true },
                        { text: "The brightness of galaxies", isCorrect: false },
                        { text: "Gravitational lensing", isCorrect: false }
                    ]
                },
                {
                    question: "The estimate t = 1/H₀ for the age of the universe is likely to be an overestimate because:",
                    options: [
                        { text: "The universe is accelerating, so galaxies were slower in the past", isCorrect: false },
                        { text: "Gravity would have slowed expansion early on, meaning galaxies were faster in the past", isCorrect: true },
                        { text: "H₀ is measured with perfect accuracy", isCorrect: false },
                        { text: "The speed of light limits how far we can see", isCorrect: false }
                    ]
                }
            ]
        }
    },
    {
        id: 10,
        title: "Critical Density of the Universe",
        youtubeId: "gQ0LCxbTPeQ",
        description: "Derives the formula for the critical density of the universe (ρ_c = 3H₀²/8πG) by starting from the definition of a flat universe — where the total energy of a galaxy is exactly zero.",
        quiz: {
            questions: [
                {
                    question: "The critical density ρ_c is derived by setting the total energy (kinetic + gravitational potential) of a galaxy equal to:",
                    options: [
                        { text: "A maximum value", isCorrect: false },
                        { text: "Zero", isCorrect: true },
                        { text: "The rest mass energy mc²", isCorrect: false },
                        { text: "The Hubble constant H₀", isCorrect: false }
                    ]
                },
                {
                    question: "The mass M of the observable universe inside radius r is written as M = ρ_c × (4/3)πr³. This treats the universe as:",
                    options: [
                        { text: "A flat disc", isCorrect: false },
                        { text: "A hollow shell", isCorrect: false },
                        { text: "A uniform sphere", isCorrect: true },
                        { text: "A point mass", isCorrect: false }
                    ]
                },
                {
                    question: "Substituting v = H₀r (Hubble's law) and M = ρ_c(4/3)πr³ into ½mv² = GMm/r and simplifying gives:",
                    options: [
                        { text: "ρ_c = H₀² / G", isCorrect: false },
                        { text: "ρ_c = 3H₀² / 8πG", isCorrect: true },
                        { text: "ρ_c = 8πG / 3H₀²", isCorrect: false },
                        { text: "ρ_c = 3G / 8πH₀²", isCorrect: false }
                    ]
                },
                {
                    question: "Using H₀ ≈ 2.2 × 10⁻¹⁸ s⁻¹, the critical density ρ_c is approximately:",
                    options: [
                        { text: "10⁻¹⁰ kg m⁻³", isCorrect: false },
                        { text: "10³ kg m⁻³", isCorrect: false },
                        { text: "10⁻²⁶ kg m⁻³", isCorrect: true },
                        { text: "10⁻⁵² kg m⁻³", isCorrect: false }
                    ]
                },
                {
                    question: "If the actual density of the universe is greater than ρ_c, the universe is:",
                    options: [
                        { text: "Flat and will expand forever", isCorrect: false },
                        { text: "Open and will expand forever", isCorrect: false },
                        { text: "Closed — gravity will eventually halt and reverse expansion", isCorrect: true },
                        { text: "Exactly at critical density", isCorrect: false }
                    ]
                }
            ]
        }
    },
    {
        id: 11,
        title: "Hall Voltage",
        youtubeId: "B_P5QwUg1mI",
        description: "Derives the formula for the Hall voltage of a semiconductor by balancing the magnetic force on charge carriers (F = Bqv) against the electric force from the build-up of charge (F = qE = qV_H/d).",
        quiz: {
            questions: [
                {
                    question: "In the Hall effect, charge carriers in a conductor are deflected sideways because of:",
                    options: [
                        { text: "Gravity acting on the electrons", isCorrect: false },
                        { text: "The magnetic force F = Bqv acting perpendicular to their motion", isCorrect: true },
                        { text: "Collisions with the crystal lattice", isCorrect: false },
                        { text: "The electric field from the current source", isCorrect: false }
                    ]
                },
                {
                    question: "Equilibrium in the Hall effect is reached when the magnetic force on carriers is balanced by:",
                    options: [
                        { text: "Friction from the lattice", isCorrect: false },
                        { text: "The electric force due to the accumulated Hall voltage: qE = qV_H/d", isCorrect: true },
                        { text: "Gravity", isCorrect: false },
                        { text: "The Lorentz force from the current", isCorrect: false }
                    ]
                },
                {
                    question: "From the equilibrium condition Bqv = qV_H/d, the Hall voltage is:",
                    options: [
                        { text: "V_H = Bv/d", isCorrect: false },
                        { text: "V_H = Bd/v", isCorrect: false },
                        { text: "V_H = Bvd", isCorrect: true },
                        { text: "V_H = B/(vd)", isCorrect: false }
                    ]
                },
                {
                    question: "Substituting drift speed v = I/(nqA) into V_H = Bvd gives the Hall voltage as:",
                    options: [
                        { text: "V_H = BId/(nqA)", isCorrect: true },
                        { text: "V_H = BnqAd/I", isCorrect: false },
                        { text: "V_H = BI/(nqd)", isCorrect: false },
                        { text: "V_H = BId/nq", isCorrect: false }
                    ]
                },
                {
                    question: "The Hall effect can identify the sign of charge carriers in a material because:",
                    options: [
                        { text: "Positive and negative carriers produce opposite polarities of Hall voltage", isCorrect: true },
                        { text: "Only electrons experience the magnetic force", isCorrect: false },
                        { text: "The magnitude of V_H changes with carrier sign", isCorrect: false },
                        { text: "The resistance of the material changes with carrier sign", isCorrect: false }
                    ]
                }
            ]
        }
    },
    {
        id: 12,
        title: "Power from Fluid Flow",
        youtubeId: "2XcMUSdz0dI",
        description: "Derives the formula for the power available from a moving fluid P = ½ρAv³ (used for wind turbines and tidal generators) by calculating the kinetic energy of a cylinder of fluid passing through area A per unit time.",
        quiz: {
            questions: [
                {
                    question: "The derivation of P = ½ρAv³ starts by finding the kinetic energy of a cylinder of fluid passing through area A in time t. The mass of that cylinder is:",
                    options: [
                        { text: "m = ρv", isCorrect: false },
                        { text: "m = ρA/t", isCorrect: false },
                        { text: "m = ρAvt", isCorrect: true },
                        { text: "m = ρv³t", isCorrect: false }
                    ]
                },
                {
                    question: "The factor ½ρv² in P = ½ρAv³ represents:",
                    options: [
                        { text: "Pressure × area", isCorrect: false },
                        { text: "The kinetic energy per unit volume of the fluid", isCorrect: true },
                        { text: "Gravitational potential energy per unit volume", isCorrect: false },
                        { text: "The work done against drag per unit volume", isCorrect: false }
                    ]
                },
                {
                    question: "In P = ½ρAv³, if the wind speed doubles (with ρ and A unchanged), the available power:",
                    options: [
                        { text: "Doubles", isCorrect: false },
                        { text: "Quadruples", isCorrect: false },
                        { text: "Increases by a factor of 8", isCorrect: true },
                        { text: "Increases by a factor of 6", isCorrect: false }
                    ]
                },
                {
                    question: "In P = ½ρAv³, A is the cross-sectional area swept by the fluid. Doubling A while keeping v and ρ constant:",
                    options: [
                        { text: "Has no effect on power", isCorrect: false },
                        { text: "Doubles the available power", isCorrect: true },
                        { text: "Quadruples the available power", isCorrect: false },
                        { text: "Halves the available power", isCorrect: false }
                    ]
                },
                {
                    question: "The Betz limit states a wind turbine can extract at most ~59% of the available wind power. This is because:",
                    options: [
                        { text: "Turbine blades are never aerodynamically perfect", isCorrect: false },
                        { text: "The turbine must leave the air with some kinetic energy — bringing it to a complete stop would block further flow", isCorrect: true },
                        { text: "Friction in the generator always removes 41% of energy", isCorrect: false },
                        { text: "Air density decreases as the turbine spins", isCorrect: false }
                    ]
                }
            ]
        }
    }
];