export interface Resource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'course' | 'documentation';
}

export interface SubTopic {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  resources: Resource[];
  prerequisites?: string[];
  subtopics: SubTopic[];
  weekNumber?: number;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  category: 'tech' | 'management' | 'design' | 'data-science';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: Topic[];
  totalHours: number;
  estimatedWeeks: number;
}

export const roadmaps: Roadmap[] = [
  {
    id: 'ai-ml',
    title: 'Artificial Intelligence & Machine Learning',
    description: 'Master AI and ML fundamentals, from basic concepts to advanced neural networks',
    category: 'tech',
    difficulty: 'intermediate',
    totalHours: 200,
    estimatedWeeks: 20,
    topics: [
      {
        id: 'ai-ml-1',
        title: 'Python Basics for AI',
        description: 'Learn Python fundamentals needed for AI/ML development',
        estimatedHours: 20,
        weekNumber: 1,
        subtopics: [
          { id: 'ai-ml-1-1', title: 'Python Installation & Setup', description: 'Setting up development environment', estimatedHours: 2 },
          { id: 'ai-ml-1-2', title: 'Variables, Data Types & Operators', description: 'Basic Python syntax and operations', estimatedHours: 3 },
          { id: 'ai-ml-1-3', title: 'Control Flow (if/else, loops)', description: 'Conditional statements and iteration', estimatedHours: 3 },
          { id: 'ai-ml-1-4', title: 'Functions & Modules', description: 'Creating reusable code blocks', estimatedHours: 4 },
          { id: 'ai-ml-1-5', title: 'Lists, Tuples, Dictionaries', description: 'Working with Python data structures', estimatedHours: 4 },
          { id: 'ai-ml-1-6', title: 'File I/O & Exception Handling', description: 'Reading/writing files and error management', estimatedHours: 4 },
        ],
        resources: [
          { title: 'Python for Everybody - Coursera', url: 'https://www.coursera.org/specializations/python', type: 'course' },
          { title: 'Python Official Tutorial', url: 'https://docs.python.org/3/tutorial/', type: 'documentation' },
          { title: 'Automate the Boring Stuff', url: 'https://automatetheboringstuff.com/', type: 'article' },
        ]
      },
      {
        id: 'ai-ml-2',
        title: 'Mathematics for ML',
        description: 'Linear algebra, calculus, and statistics for machine learning',
        estimatedHours: 40,
        weekNumber: 3,
        prerequisites: ['ai-ml-1'],
        subtopics: [
          { id: 'ai-ml-2-1', title: 'Vectors & Matrices', description: 'Basic linear algebra concepts', estimatedHours: 6 },
          { id: 'ai-ml-2-2', title: 'Matrix Operations', description: 'Multiplication, transpose, inverse', estimatedHours: 6 },
          { id: 'ai-ml-2-3', title: 'Eigenvalues & Eigenvectors', description: 'Advanced linear algebra', estimatedHours: 6 },
          { id: 'ai-ml-2-4', title: 'Derivatives & Gradients', description: 'Calculus fundamentals', estimatedHours: 6 },
          { id: 'ai-ml-2-5', title: 'Probability Theory', description: 'Basic probability concepts', estimatedHours: 6 },
          { id: 'ai-ml-2-6', title: 'Statistics & Distributions', description: 'Statistical analysis basics', estimatedHours: 10 },
        ],
        resources: [
          { title: '3Blue1Brown Linear Algebra', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', type: 'video' },
          { title: 'Khan Academy Statistics', url: 'https://www.khanacademy.org/math/statistics-probability', type: 'course' },
          { title: 'Mathematics for Machine Learning', url: 'https://mml-book.github.io/', type: 'article' },
        ]
      },
      {
        id: 'ai-ml-3',
        title: 'Introduction to ML',
        description: 'Core ML concepts, supervised and unsupervised learning',
        estimatedHours: 30,
        weekNumber: 7,
        prerequisites: ['ai-ml-2'],
        subtopics: [
          { id: 'ai-ml-3-1', title: 'ML Fundamentals & Terminology', description: 'Basic concepts and definitions', estimatedHours: 3 },
          { id: 'ai-ml-3-2', title: 'Linear Regression', description: 'First supervised learning algorithm', estimatedHours: 5 },
          { id: 'ai-ml-3-3', title: 'Logistic Regression & Classification', description: 'Binary and multiclass classification', estimatedHours: 5 },
          { id: 'ai-ml-3-4', title: 'Decision Trees & Random Forests', description: 'Tree-based algorithms', estimatedHours: 5 },
          { id: 'ai-ml-3-5', title: 'K-Means & Clustering', description: 'Unsupervised learning methods', estimatedHours: 4 },
          { id: 'ai-ml-3-6', title: 'Model Evaluation & Validation', description: 'Cross-validation, metrics, overfitting', estimatedHours: 5 },
          { id: 'ai-ml-3-7', title: 'Feature Engineering', description: 'Creating and selecting features', estimatedHours: 3 },
        ],
        resources: [
          { title: 'Andrew Ng ML Course', url: 'https://www.coursera.org/learn/machine-learning', type: 'course' },
          { title: 'Scikit-learn Documentation', url: 'https://scikit-learn.org/stable/tutorial/index.html', type: 'documentation' },
          { title: 'StatQuest ML Playlist', url: 'https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF', type: 'video' },
        ]
      },
      {
        id: 'ai-ml-4',
        title: 'Deep Learning Fundamentals',
        description: 'Neural networks, backpropagation, and optimization',
        estimatedHours: 40,
        weekNumber: 10,
        prerequisites: ['ai-ml-3'],
        subtopics: [
          { id: 'ai-ml-4-1', title: 'Neural Networks Basics', description: 'Perceptrons and activation functions', estimatedHours: 5 },
          { id: 'ai-ml-4-2', title: 'Forward & Backpropagation', description: 'How neural networks learn', estimatedHours: 6 },
          { id: 'ai-ml-4-3', title: 'Gradient Descent & Optimization', description: 'SGD, Adam, RMSprop', estimatedHours: 5 },
          { id: 'ai-ml-4-4', title: 'Regularization Techniques', description: 'Dropout, L1/L2, batch normalization', estimatedHours: 5 },
          { id: 'ai-ml-4-5', title: 'PyTorch/TensorFlow Basics', description: 'Deep learning frameworks', estimatedHours: 8 },
          { id: 'ai-ml-4-6', title: 'Training Deep Networks', description: 'Best practices and hyperparameter tuning', estimatedHours: 6 },
          { id: 'ai-ml-4-7', title: 'Practical Projects', description: 'Building your first neural networks', estimatedHours: 5 },
        ],
        resources: [
          { title: 'Deep Learning Specialization', url: 'https://www.coursera.org/specializations/deep-learning', type: 'course' },
          { title: 'Neural Networks 3Blue1Brown', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi', type: 'video' },
          { title: 'Deep Learning Book', url: 'https://www.deeplearningbook.org/', type: 'article' },
        ]
      },
      {
        id: 'ai-ml-5',
        title: 'Computer Vision',
        description: 'CNNs, image processing, and modern CV architectures',
        estimatedHours: 35,
        weekNumber: 14,
        prerequisites: ['ai-ml-4'],
        subtopics: [
          { id: 'ai-ml-5-1', title: 'Image Processing Basics', description: 'Filters, edges, transformations', estimatedHours: 4 },
          { id: 'ai-ml-5-2', title: 'Convolutional Neural Networks', description: 'Conv layers, pooling, architectures', estimatedHours: 6 },
          { id: 'ai-ml-5-3', title: 'Classic Architectures', description: 'VGG, ResNet, Inception', estimatedHours: 6 },
          { id: 'ai-ml-5-4', title: 'Object Detection', description: 'YOLO, R-CNN, SSD', estimatedHours: 6 },
          { id: 'ai-ml-5-5', title: 'Image Segmentation', description: 'U-Net, Mask R-CNN', estimatedHours: 5 },
          { id: 'ai-ml-5-6', title: 'Transfer Learning', description: 'Using pre-trained models', estimatedHours: 4 },
          { id: 'ai-ml-5-7', title: 'CV Projects', description: 'Real-world applications', estimatedHours: 4 },
        ],
        resources: [
          { title: 'Stanford CS231n', url: 'http://cs231n.stanford.edu/', type: 'course' },
          { title: 'PyTorch Computer Vision', url: 'https://pytorch.org/vision/stable/index.html', type: 'documentation' },
          { title: 'Papers with Code CV', url: 'https://paperswithcode.com/area/computer-vision', type: 'article' },
        ]
      },
      {
        id: 'ai-ml-6',
        title: 'Natural Language Processing',
        description: 'Text processing, transformers, and language models',
        estimatedHours: 35,
        weekNumber: 17,
        prerequisites: ['ai-ml-4'],
        subtopics: [
          { id: 'ai-ml-6-1', title: 'Text Preprocessing', description: 'Tokenization, stemming, lemmatization', estimatedHours: 4 },
          { id: 'ai-ml-6-2', title: 'Word Embeddings', description: 'Word2Vec, GloVe, FastText', estimatedHours: 5 },
          { id: 'ai-ml-6-3', title: 'RNNs & LSTMs', description: 'Sequential models for text', estimatedHours: 6 },
          { id: 'ai-ml-6-4', title: 'Attention Mechanisms', description: 'Understanding attention', estimatedHours: 5 },
          { id: 'ai-ml-6-5', title: 'Transformers & BERT', description: 'Modern NLP architectures', estimatedHours: 6 },
          { id: 'ai-ml-6-6', title: 'Large Language Models', description: 'GPT, fine-tuning, prompting', estimatedHours: 5 },
          { id: 'ai-ml-6-7', title: 'NLP Applications', description: 'Sentiment analysis, QA, translation', estimatedHours: 4 },
        ],
        resources: [
          { title: 'Hugging Face NLP Course', url: 'https://huggingface.co/learn/nlp-course', type: 'course' },
          { title: 'Stanford NLP Course', url: 'http://web.stanford.edu/class/cs224n/', type: 'course' },
          { title: 'Jay Alammar Blog', url: 'https://jalammar.github.io/', type: 'article' },
        ]
      }
    ]
  },
  {
    id: 'python-dev',
    title: 'Python Development',
    description: 'Complete Python developer roadmap from basics to advanced frameworks',
    category: 'tech',
    difficulty: 'beginner',
    totalHours: 150,
    estimatedWeeks: 15,
    topics: [
      {
        id: 'python-1',
        title: 'Python Fundamentals',
        description: 'Variables, data types, control flow, functions',
        estimatedHours: 25,
        weekNumber: 1,
        subtopics: [
          { id: 'python-1-1', title: 'Getting Started with Python', description: 'Installation and IDE setup', estimatedHours: 2 },
          { id: 'python-1-2', title: 'Variables & Data Types', description: 'Numbers, strings, booleans', estimatedHours: 4 },
          { id: 'python-1-3', title: 'Operators & Expressions', description: 'Arithmetic, comparison, logical operators', estimatedHours: 3 },
          { id: 'python-1-4', title: 'Control Structures', description: 'if/elif/else statements', estimatedHours: 4 },
          { id: 'python-1-5', title: 'Loops', description: 'for and while loops, break, continue', estimatedHours: 4 },
          { id: 'python-1-6', title: 'Functions', description: 'Defining and calling functions, parameters', estimatedHours: 5 },
          { id: 'python-1-7', title: 'Basic Projects', description: 'Calculator, number guessing game', estimatedHours: 3 },
        ],
        resources: [
          { title: 'Python Official Tutorial', url: 'https://docs.python.org/3/tutorial/', type: 'documentation' },
          { title: 'Corey Schafer Python Basics', url: 'https://www.youtube.com/playlist?list=PL-osiE80TeTskrapNbzXhwoFUiLCjGgY7', type: 'video' },
          { title: 'Real Python Tutorials', url: 'https://realpython.com/', type: 'article' },
        ]
      },
      {
        id: 'python-2',
        title: 'Object-Oriented Programming',
        description: 'Classes, inheritance, polymorphism, encapsulation',
        estimatedHours: 20,
        weekNumber: 3,
        prerequisites: ['python-1'],
        subtopics: [
          { id: 'python-2-1', title: 'Classes & Objects', description: 'Understanding OOP concepts', estimatedHours: 4 },
          { id: 'python-2-2', title: 'Attributes & Methods', description: 'Instance and class attributes', estimatedHours: 3 },
          { id: 'python-2-3', title: 'Inheritance', description: 'Creating child classes', estimatedHours: 4 },
          { id: 'python-2-4', title: 'Polymorphism', description: 'Method overriding and overloading', estimatedHours: 3 },
          { id: 'python-2-5', title: 'Encapsulation', description: 'Private and public members', estimatedHours: 3 },
          { id: 'python-2-6', title: 'Special Methods', description: 'Dunder methods (__init__, __str__, etc.)', estimatedHours: 3 },
        ],
        resources: [
          { title: 'OOP in Python - Real Python', url: 'https://realpython.com/python3-object-oriented-programming/', type: 'article' },
          { title: 'Corey Schafer OOP Series', url: 'https://www.youtube.com/playlist?list=PL-osiE80TeTsqhIuOqKhwlXsIBIdSeYtc', type: 'video' },
          { title: 'Python OOP Documentation', url: 'https://docs.python.org/3/tutorial/classes.html', type: 'documentation' },
        ]
      },
      {
        id: 'python-3',
        title: 'Data Structures & Algorithms',
        description: 'Lists, dictionaries, sets, algorithms, complexity',
        estimatedHours: 30,
        weekNumber: 5,
        prerequisites: ['python-2'],
        subtopics: [
          { id: 'python-3-1', title: 'Lists & List Comprehension', description: 'Advanced list operations', estimatedHours: 5 },
          { id: 'python-3-2', title: 'Dictionaries & Sets', description: 'Hash-based data structures', estimatedHours: 5 },
          { id: 'python-3-3', title: 'Stacks & Queues', description: 'LIFO and FIFO structures', estimatedHours: 4 },
          { id: 'python-3-4', title: 'Searching Algorithms', description: 'Linear and binary search', estimatedHours: 4 },
          { id: 'python-3-5', title: 'Sorting Algorithms', description: 'Bubble, merge, quick sort', estimatedHours: 5 },
          { id: 'python-3-6', title: 'Big O Notation', description: 'Time and space complexity', estimatedHours: 4 },
          { id: 'python-3-7', title: 'Practice Problems', description: 'LeetCode easy problems', estimatedHours: 3 },
        ],
        resources: [
          { title: 'LeetCode Python', url: 'https://leetcode.com/', type: 'course' },
          { title: 'Python Data Structures', url: 'https://docs.python.org/3/tutorial/datastructures.html', type: 'documentation' },
          { title: 'AlgoExpert Python', url: 'https://www.algoexpert.io/', type: 'course' },
        ]
      },
      {
        id: 'python-4',
        title: 'Web Development with Django/Flask',
        description: 'Build web applications with Python frameworks',
        estimatedHours: 40,
        weekNumber: 8,
        prerequisites: ['python-3'],
        subtopics: [
          { id: 'python-4-1', title: 'HTTP & Web Basics', description: 'Understanding web protocols', estimatedHours: 4 },
          { id: 'python-4-2', title: 'Flask Introduction', description: 'First Flask application', estimatedHours: 6 },
          { id: 'python-4-3', title: 'Routing & Templates', description: 'URL routing and Jinja2', estimatedHours: 6 },
          { id: 'python-4-4', title: 'Forms & Validation', description: 'Handling user input', estimatedHours: 5 },
          { id: 'python-4-5', title: 'Django Framework', description: 'Django setup and structure', estimatedHours: 8 },
          { id: 'python-4-6', title: 'Django Models & ORM', description: 'Database integration', estimatedHours: 6 },
          { id: 'python-4-7', title: 'Building a Blog', description: 'Complete web application project', estimatedHours: 5 },
        ],
        resources: [
          { title: 'Django Official Tutorial', url: 'https://docs.djangoproject.com/en/stable/intro/tutorial01/', type: 'documentation' },
          { title: 'Flask Mega Tutorial', url: 'https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world', type: 'article' },
          { title: 'Corey Schafer Django Series', url: 'https://www.youtube.com/playlist?list=PL-osiE80TeTtoQCKZ03TU5fNfx2UY6U4p', type: 'video' },
        ]
      },
      {
        id: 'python-5',
        title: 'Database & APIs',
        description: 'SQL, REST APIs, authentication, deployment',
        estimatedHours: 35,
        weekNumber: 12,
        prerequisites: ['python-4'],
        subtopics: [
          { id: 'python-5-1', title: 'SQL Fundamentals', description: 'Basic database queries', estimatedHours: 6 },
          { id: 'python-5-2', title: 'SQLAlchemy ORM', description: 'Python database toolkit', estimatedHours: 6 },
          { id: 'python-5-3', title: 'REST API Concepts', description: 'HTTP methods, status codes', estimatedHours: 4 },
          { id: 'python-5-4', title: 'Building APIs with Flask/Django', description: 'Creating RESTful services', estimatedHours: 7 },
          { id: 'python-5-5', title: 'Authentication & Security', description: 'JWT, OAuth, password hashing', estimatedHours: 6 },
          { id: 'python-5-6', title: 'Deployment', description: 'Heroku, AWS, Docker basics', estimatedHours: 6 },
        ],
        resources: [
          { title: 'SQLAlchemy Tutorial', url: 'https://docs.sqlalchemy.org/en/tutorial/', type: 'documentation' },
          { title: 'Django REST Framework', url: 'https://www.django-rest-framework.org/tutorial/quickstart/', type: 'documentation' },
          { title: 'FastAPI Course', url: 'https://fastapi.tiangolo.com/tutorial/', type: 'documentation' },
        ]
      }
    ]
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    description: 'Essential DSA concepts for coding interviews and problem solving',
    category: 'tech',
    difficulty: 'intermediate',
    totalHours: 160,
    estimatedWeeks: 16,
    topics: [
      {
        id: 'dsa-1',
        title: 'Arrays & Strings',
        description: 'Basic operations, two pointers, sliding window',
        estimatedHours: 20,
        weekNumber: 1,
        subtopics: [
          { id: 'dsa-1-1', title: 'Array Basics', description: 'Traversal, insertion, deletion', estimatedHours: 3 },
          { id: 'dsa-1-2', title: 'Two Pointer Technique', description: 'Solving array problems efficiently', estimatedHours: 4 },
          { id: 'dsa-1-3', title: 'Sliding Window', description: 'Subarray problems', estimatedHours: 4 },
          { id: 'dsa-1-4', title: 'String Manipulation', description: 'Common string algorithms', estimatedHours: 4 },
          { id: 'dsa-1-5', title: 'Pattern Matching', description: 'KMP, Rabin-Karp algorithms', estimatedHours: 5 },
        ],
        resources: [
          { title: 'Arrays - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/array-data-structure/', type: 'article' },
          { title: 'LeetCode Arrays', url: 'https://leetcode.com/tag/array/', type: 'course' },
          { title: 'Abdul Bari Arrays', url: 'https://www.youtube.com/watch?v=AT14lCXuMKI', type: 'video' },
        ]
      },
      {
        id: 'dsa-2',
        title: 'Linked Lists',
        description: 'Singly, doubly, circular linked lists and operations',
        estimatedHours: 20,
        weekNumber: 3,
        prerequisites: ['dsa-1'],
        subtopics: [
          { id: 'dsa-2-1', title: 'Singly Linked List', description: 'Basic operations', estimatedHours: 4 },
          { id: 'dsa-2-2', title: 'Doubly Linked List', description: 'Bidirectional traversal', estimatedHours: 4 },
          { id: 'dsa-2-3', title: 'Circular Linked List', description: 'Circular structures', estimatedHours: 3 },
          { id: 'dsa-2-4', title: 'Linked List Problems', description: 'Reversal, cycle detection', estimatedHours: 5 },
          { id: 'dsa-2-5', title: 'Advanced Techniques', description: 'Fast & slow pointers', estimatedHours: 4 },
        ],
        resources: [
          { title: 'Linked Lists Tutorial', url: 'https://www.geeksforgeeks.org/data-structures/linked-list/', type: 'article' },
          { title: 'LeetCode Linked List', url: 'https://leetcode.com/tag/linked-list/', type: 'course' },
          { title: 'mycodeschool Linked Lists', url: 'https://www.youtube.com/playlist?list=PL2_aWCzGMAwI3W_JlcBbtYTwiQSsOTa6P', type: 'video' },
        ]
      },
      {
        id: 'dsa-3',
        title: 'Stacks & Queues',
        description: 'Stack/queue operations, monotonic stack, deque',
        estimatedHours: 15,
        weekNumber: 5,
        prerequisites: ['dsa-2'],
        subtopics: [
          { id: 'dsa-3-1', title: 'Stack Implementation', description: 'Array and linked list based', estimatedHours: 3 },
          { id: 'dsa-3-2', title: 'Queue Implementation', description: 'Simple and circular queues', estimatedHours: 3 },
          { id: 'dsa-3-3', title: 'Monotonic Stack', description: 'Next greater element problems', estimatedHours: 4 },
          { id: 'dsa-3-4', title: 'Deque', description: 'Double-ended queue', estimatedHours: 3 },
          { id: 'dsa-3-5', title: 'Applications', description: 'Expression evaluation, BFS', estimatedHours: 2 },
        ],
        resources: [
          { title: 'Stacks and Queues', url: 'https://www.geeksforgeeks.org/stack-data-structure/', type: 'article' },
          { title: 'LeetCode Stack', url: 'https://leetcode.com/tag/stack/', type: 'course' },
          { title: 'Stack & Queue Video', url: 'https://www.youtube.com/watch?v=wjI1WNcIntg', type: 'video' },
        ]
      },
      {
        id: 'dsa-4',
        title: 'Trees & Binary Search Trees',
        description: 'Tree traversals, BST operations, balanced trees',
        estimatedHours: 30,
        weekNumber: 6,
        prerequisites: ['dsa-3'],
        subtopics: [
          { id: 'dsa-4-1', title: 'Binary Tree Basics', description: 'Structure and terminology', estimatedHours: 4 },
          { id: 'dsa-4-2', title: 'Tree Traversals', description: 'Inorder, preorder, postorder, level-order', estimatedHours: 6 },
          { id: 'dsa-4-3', title: 'Binary Search Trees', description: 'BST operations', estimatedHours: 5 },
          { id: 'dsa-4-4', title: 'AVL Trees', description: 'Self-balancing BST', estimatedHours: 5 },
          { id: 'dsa-4-5', title: 'Tree Problems', description: 'Common interview questions', estimatedHours: 6 },
          { id: 'dsa-4-6', title: 'Trie', description: 'Prefix tree for strings', estimatedHours: 4 },
        ],
        resources: [
          { title: 'Trees Tutorial', url: 'https://www.geeksforgeeks.org/binary-tree-data-structure/', type: 'article' },
          { title: 'LeetCode Trees', url: 'https://leetcode.com/tag/tree/', type: 'course' },
          { title: 'Tree Algorithms', url: 'https://www.youtube.com/playlist?list=PL2_aWCzGMAwI3W_JlcBbtYTwiQSsOTa6P', type: 'video' },
        ]
      },
      {
        id: 'dsa-5',
        title: 'Graphs',
        description: 'Graph representations, BFS, DFS, shortest paths',
        estimatedHours: 35,
        weekNumber: 9,
        prerequisites: ['dsa-4'],
        subtopics: [
          { id: 'dsa-5-1', title: 'Graph Representations', description: 'Adjacency matrix and list', estimatedHours: 4 },
          { id: 'dsa-5-2', title: 'Graph Traversals', description: 'BFS and DFS', estimatedHours: 6 },
          { id: 'dsa-5-3', title: 'Shortest Path Algorithms', description: 'Dijkstra, Bellman-Ford', estimatedHours: 7 },
          { id: 'dsa-5-4', title: 'Minimum Spanning Tree', description: 'Prim and Kruskal algorithms', estimatedHours: 6 },
          { id: 'dsa-5-5', title: 'Topological Sort', description: 'DAG ordering', estimatedHours: 4 },
          { id: 'dsa-5-6', title: 'Advanced Graph Problems', description: 'Strongly connected components', estimatedHours: 8 },
        ],
        resources: [
          { title: 'Graph Algorithms', url: 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/', type: 'article' },
          { title: 'LeetCode Graphs', url: 'https://leetcode.com/tag/graph/', type: 'course' },
          { title: 'William Fiset Graphs', url: 'https://www.youtube.com/playlist?list=PLDV1Zeh2NRsDGO4--qE8yH72HFL1Km93P', type: 'video' },
        ]
      },
      {
        id: 'dsa-6',
        title: 'Dynamic Programming',
        description: 'DP patterns, memoization, tabulation, optimization',
        estimatedHours: 40,
        weekNumber: 13,
        prerequisites: ['dsa-5'],
        subtopics: [
          { id: 'dsa-6-1', title: 'DP Introduction', description: 'Understanding DP concept', estimatedHours: 4 },
          { id: 'dsa-6-2', title: 'Memoization', description: 'Top-down approach', estimatedHours: 6 },
          { id: 'dsa-6-3', title: 'Tabulation', description: 'Bottom-up approach', estimatedHours: 6 },
          { id: 'dsa-6-4', title: 'Classic DP Problems', description: 'Fibonacci, knapsack, LCS', estimatedHours: 8 },
          { id: 'dsa-6-5', title: 'DP on Trees', description: 'Tree DP problems', estimatedHours: 6 },
          { id: 'dsa-6-6', title: 'DP on Graphs', description: 'Graph DP problems', estimatedHours: 6 },
          { id: 'dsa-6-7', title: 'Advanced DP', description: 'Bitmask DP, digit DP', estimatedHours: 4 },
        ],
        resources: [
          { title: 'DP Patterns', url: 'https://www.geeksforgeeks.org/dynamic-programming/', type: 'article' },
          { title: 'LeetCode DP', url: 'https://leetcode.com/tag/dynamic-programming/', type: 'course' },
          { title: 'Aditya Verma DP', url: 'https://www.youtube.com/playlist?list=PL_z_8CaSLPWekqhdCPmFohncHwz8TY2Go', type: 'video' },
        ]
      }
    ]
  }
];
