import type { GlossaryTerm, AITool, ContentItem } from '../types';

export const preloadedGlossaryTerms: GlossaryTerm[] = [
  {
    id: '1',
    term: 'Artificial Intelligence (AI)',
    definition: 'The simulation of human intelligence processes by computer systems, including learning, reasoning, and self-correction.',
    learnMoreUrl: 'https://en.wikipedia.org/wiki/Artificial_intelligence'
  },
  {
    id: '2',
    term: 'Machine Learning',
    definition: 'A subset of AI that enables systems to learn and improve from experience without being explicitly programmed.',
    learnMoreUrl: 'https://en.wikipedia.org/wiki/Machine_learning'
  },
  {
    id: '3',
    term: 'Natural Language Processing (NLP)',
    definition: 'The interaction between computers and human language, enabling machines to understand, interpret, and generate human language.',
    learnMoreUrl: 'https://en.wikipedia.org/wiki/Natural_language_processing'
  },
  {
    id: '4',
    term: 'Large Language Model (LLM)',
    definition: 'A type of AI model trained on vast amounts of text data to understand and generate human-like text.',
    learnMoreUrl: 'https://en.wikipedia.org/wiki/Large_language_model'
  },
  {
    id: '5',
    term: 'Prompt Engineering',
    definition: 'The art of crafting effective inputs (prompts) to guide AI models toward desired outputs.',
    learnMoreUrl: 'https://en.wikipedia.org/wiki/Prompt_engineering'
  },
  {
    id: '6',
    term: 'Neural Network',
    definition: 'A computing system inspired by biological neural networks, consisting of interconnected nodes (neurons) that process information.',
    learnMoreUrl: 'https://en.wikipedia.org/wiki/Neural_network'
  },
  {
    id: '7',
    term: 'Training Data',
    definition: 'The dataset used to teach AI models patterns, relationships, and knowledge required for making predictions or decisions.',
    learnMoreUrl: 'https://en.wikipedia.org/wiki/Training,_validation,_and_test_data_sets'
  },
  {
    id: '8',
    term: 'Inference',
    definition: 'The process of using a trained AI model to make predictions or generate outputs based on new input data.',
    learnMoreUrl: 'https://en.wikipedia.org/wiki/Inference'
  },
  {
    id: '9',
    term: 'Hallucination',
    definition: 'When AI generates confident but incorrect or nonsensical information that appears plausible.',
    learnMoreUrl: 'https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)'
  },
  {
    id: '10',
    term: 'Fine-tuning',
    definition: 'The process of further training a pre-trained model on a specific dataset to improve its performance for particular tasks.',
    learnMoreUrl: 'https://en.wikipedia.org/wiki/Fine-tuning_(transfer_learning)'
  },
  {
    id: '11',
    term: 'Token',
    definition: 'The basic unit of text that AI models process, which can be a word, part of a word, or character.',
    learnMoreUrl: 'https://en.wikipedia.org/wiki/Tokenization_(lexical_analysis)'
  },
  {
    id: '12',
    term: 'Temperature',
    definition: 'A parameter that controls the randomness of AI-generated text, with lower values producing more deterministic outputs.',
    learnMoreUrl: 'https://docs.openai.com/api-reference/parameter-details'
  },
  {
    id: '13',
    term: 'Context Window',
    definition: 'The maximum amount of text (in tokens) an AI model can consider when generating a response.',
    learnMoreUrl: 'https://www.anthropic.com/index/context-window'
  },
  {
    id: '14',
    term: 'Zero-shot Learning',
    definition: 'The ability of AI models to perform tasks without seeing examples, using only task descriptions.',
    learnMoreUrl: 'https://en.wikipedia.org/wiki/Zero-shot_learning'
  },
  {
    id: '15',
    term: 'Few-shot Learning',
    definition: 'A learning approach where AI models learn from just a few examples rather than extensive training data.',
    learnMoreUrl: 'https://en.wikipedia.org/wiki/Few-shot_learning'
  },
  {
    id: '16',
    term: 'Chain of Thought',
    definition: 'A prompting technique that encourages AI models to break down complex problems into step-by-step reasoning.',
    learnMoreUrl: 'https://arxiv.org/abs/2201.11903'
  },
  {
    id: '17',
    term: 'Bias',
    definition: 'Systematic errors in AI outputs that reflect prejudices present in training data or model design.',
    learnMoreUrl: 'https://en.wikipedia.org/wiki/Bias_(AI)'
  },
  {
    id: '18',
    term: 'Ethics in AI',
    definition: 'The study of moral principles and values that should guide the development and use of AI systems.',
    learnMoreUrl: 'https://en.wikipedia.org/wiki/AI_ethics'
  },
  {
    id: '19',
    term: 'AGI (Artificial General Intelligence)',
    definition: 'Hypothetical AI systems with human-level or greater intelligence across all cognitive tasks.',
    learnMoreUrl: 'https://en.wikipedia.org/wiki/Artificial_general_intelligence'
  },
  {
    id: '20',
    term: 'Transformer Architecture',
    definition: 'A deep learning architecture that uses attention mechanisms to process sequential data, revolutionizing NLP.',
    learnMoreUrl: 'https://en.wikipedia.org/wiki/Transformer_(deep_learning_architecture)'
  }
];

export const preloadedAITools: AITool[] = [
  {
    id: '1',
    name: 'ChatGPT',
    category: 'Chatbot',
    description: 'A conversational AI assistant by OpenAI that can answer questions, write content, and assist with various tasks.',
    url: 'https://chat.openai.com'
  },
  {
    id: '2',
    name: 'Claude',
    category: 'Chatbot',
    description: 'An AI assistant by Anthropic designed to be helpful, harmless, and honest with strong safety features.',
    url: 'https://claude.ai'
  },
  {
    id: '3',
    name: 'Midjourney',
    category: 'Image Generation',
    description: 'An AI tool that generates high-quality images from text descriptions, popular for creative projects.',
    url: 'https://midjourney.com'
  },
  {
    id: '4',
    name: 'DALL·E 3',
    category: 'Image Generation',
    description: 'OpenAI\'s image generation model that creates detailed images from natural language descriptions.',
    url: 'https://openai.com/dall-e-3'
  },
  {
    id: '5',
    name: 'GitHub Copilot',
    category: 'Code Assistance',
    description: 'An AI pair programmer that suggests code completions and functions in real-time within your editor.',
    url: 'https://github.com/features/copilot'
  },
  {
    id: '6',
    name: 'Perplexity AI',
    category: 'Research',
    description: 'An AI-powered search engine that provides direct answers with cited sources for factual queries.',
    url: 'https://perplexity.ai'
  }
];

export const preloadedContent: ContentItem[] = [
  {
    id: 'mindset-1',
    type: 'link',
    title: 'The AI Mindset Shift',
    description: 'Understanding how to think about AI as a collaborator rather than a replacement.',
    url: 'https://www.centerforappliedai.com',
    section: 'mindset',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mindset-2',
    type: 'text',
    title: 'Embracing Continuous Learning',
    description: 'AI technology evolves rapidly. The most valuable skill is the ability to learn and adapt continuously.',
    section: 'mindset',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'skillset-1',
    type: 'link',
    title: 'Effective Prompting Guide',
    description: 'Learn the fundamentals of crafting prompts that get the best results from AI models.',
    url: 'https://www.promptingguide.ai',
    section: 'skillSet',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'skillset-2',
    type: 'text',
    title: 'Critical Thinking with AI',
    description: 'Developing the ability to verify AI outputs and think critically about AI-generated content.',
    section: 'skillSet',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'toolset-1',
    type: 'link',
    title: 'Getting Started with Claude',
    description: 'A beginner-friendly introduction to using Claude for everyday tasks.',
    url: 'https://claude.ai/guide',
    section: 'toolSet',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'toolset-2',
    type: 'text',
    title: 'Choosing the Right AI Tool',
    description: 'A framework for selecting the best AI tool for specific tasks and use cases.',
    section: 'toolSet',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];