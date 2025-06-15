import { Component, OnInit } from '@angular/core';
import { GeneralMentalHealthDisordersAdvicesResponseDto } from '../../interfaces/general-mental-health-disorders-advices-response-dto';
import { QuestionAnswerResponseDto } from '../../interfaces/question-answer-response-dto';


@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {
  // Mental Health Disorders Data
  mentalHealthDisorders: GeneralMentalHealthDisordersAdvicesResponseDto[] = [];
  expandedDisorders: Set<number> = new Set();

  // FAQs Data
  allFaqs: QuestionAnswerResponseDto[] = [];
  displayedFaqs: QuestionAnswerResponseDto[] = [];
  private readonly faqsPerPage = 10;

  constructor() {}

  ngOnInit(): void {
    this.loadMentalHealthDisorders();
    this.loadFaqs();
  }

  /**
   * Load mental health disorders data
   * Replace this with your actual service call
   */
  private loadMentalHealthDisorders(): void {
    // Mock data - replace with actual service call
    this.mentalHealthDisorders = [
      {
        id: 1,
        disorder: 'Anxiety Disorders',
        advices: [
          'Practice deep breathing exercises daily to help manage acute anxiety symptoms',
          'Establish a regular sleep schedule to support emotional regulation',
          'Limit caffeine intake as it can worsen anxiety symptoms',
          'Engage in regular physical exercise to reduce stress hormones',
          'Consider mindfulness meditation or progressive muscle relaxation',
          'Keep a journal to identify anxiety triggers and patterns',
          'Maintain social connections and don\'t isolate yourself',
          'Seek professional help if anxiety interferes with daily functioning'
        ]
      },
      {
        id: 2,
        disorder: 'Depression',
        advices: [
          'Maintain a consistent daily routine even when motivation is low',
          'Set small, achievable goals to build momentum and confidence',
          'Stay physically active, even light exercise can improve mood',
          'Eat nutritious meals regularly to support brain health',
          'Get adequate sunlight exposure, especially in morning hours',
          'Practice self-compassion and avoid harsh self-criticism',
          'Stay connected with supportive friends and family members',
          'Consider therapy or counseling to develop coping strategies',
          'Limit alcohol and avoid recreational drugs',
          'Be patient with the recovery process'
        ]
      },
      {
        id: 3,
        disorder: 'ADHD (Attention Deficit Hyperactivity Disorder)',
        advices: [
          'Create structured daily routines and stick to consistent schedules',
          'Use organizational tools like planners, apps, or reminder systems',
          'Break large tasks into smaller, manageable steps',
          'Minimize distractions in your work and study environments',
          'Take regular breaks during focused work sessions',
          'Practice mindfulness to improve attention and self-awareness',
          'Get regular exercise to help manage hyperactivity and improve focus',
          'Maintain good sleep hygiene for better cognitive function',
          'Consider medication options in consultation with healthcare providers',
          'Join support groups to connect with others who understand ADHD'
        ]
      },
      {
        id: 4,
        disorder: 'Bipolar Disorder',
        advices: [
          'Take prescribed medications consistently and as directed',
          'Monitor mood changes and maintain a mood diary',
          'Establish regular sleep patterns and avoid sleep deprivation',
          'Learn to recognize early warning signs of mood episodes',
          'Avoid alcohol and recreational drugs which can trigger episodes',
          'Build a strong support network of family, friends, and professionals',
          'Practice stress management techniques like meditation or yoga',
          'Maintain regular medical appointments and medication reviews',
          'Create a crisis plan for managing severe mood episodes',
          'Educate yourself and loved ones about bipolar disorder'
        ]
      },
      {
        id: 5,
        disorder: 'Post-Traumatic Stress Disorder (PTSD)',
        advices: [
          'Work with a trauma-informed therapist experienced in PTSD treatment',
          'Practice grounding techniques during flashbacks or panic attacks',
          'Develop a safety plan for managing triggering situations',
          'Maintain regular sleep schedules despite potential nightmares',
          'Engage in physical activities that help process trauma',
          'Build and maintain supportive relationships with trusted individuals',
          'Avoid alcohol and drugs as coping mechanisms',
          'Learn about trauma responses to better understand your reactions',
          'Consider evidence-based treatments like EMDR or CPT',
          'Be patient with the healing process and celebrate small victories'
        ]
      },
      {
        id: 6,
        disorder: 'Obsessive-Compulsive Disorder (OCD)',
        advices: [
          'Practice exposure and response prevention (ERP) techniques',
          'Challenge obsessive thoughts without engaging in compulsions',
          'Learn mindfulness techniques to observe thoughts without judgment',
          'Gradually reduce avoidance behaviors and safety-seeking actions',
          'Build tolerance for uncertainty and uncomfortable feelings',
          'Maintain regular therapy sessions with an OCD specialist',
          'Consider medication options in consultation with psychiatrists',
          'Educate family members about OCD to improve support',
          'Join OCD support groups for peer understanding and encouragement',
          'Practice self-compassion during difficult moments'
        ]
      }
    ];
  }

  /**
   * Load FAQs data
   * Replace this with your actual service call
   */
  private loadFaqs(): void {
    // Mock data - replace with actual service call
    this.allFaqs = [
      {
        id: 1,
        question: 'What is the difference between feeling sad and being depressed?',
        answer: 'Sadness is a normal emotional response to life events and usually passes with time. Depression is a persistent mental health condition that affects daily functioning, sleep, appetite, and energy levels for weeks or months. Professional help is recommended if symptoms persist beyond two weeks.'
      },
      {
        id: 2,
        question: 'How do I know if I need professional mental health support?',
        answer: 'Consider seeking professional help if mental health symptoms interfere with daily activities, relationships, work, or school for more than two weeks. Warning signs include persistent sadness, anxiety, changes in sleep or appetite, substance use, or thoughts of self-harm.'
      },
      {
        id: 3,
        question: 'What types of mental health professionals are available?',
        answer: 'Mental health professionals include psychiatrists (medical doctors who can prescribe medication), psychologists (provide therapy and testing), licensed clinical social workers, counselors, and therapists. Each has different training and specializations to address various mental health needs.'
      },
      {
        id: 4,
        question: 'Is therapy confidential?',
        answer: 'Yes, therapy is generally confidential. Mental health professionals are bound by ethical and legal obligations to protect client privacy. Exceptions include imminent danger to self or others, child abuse, or court orders. Your therapist will explain confidentiality limits during your first session.'
      },
      {
        id: 5,
        question: 'How long does therapy typically take?',
        answer: 'Therapy duration varies greatly depending on individual needs, goals, and the type of therapy. Some people benefit from short-term therapy (6-12 sessions), while others engage in longer-term treatment. Your therapist will work with you to establish realistic timelines and goals.'
      },
      {
        id: 6,
        question: 'What should I expect in my first therapy session?',
        answer: 'The first session typically involves discussing your concerns, mental health history, and goals for therapy. Your therapist will explain their approach, confidentiality policies, and answer questions. It\'s normal to feel nervous, and it may take a few sessions to feel comfortable.'
      },
      {
        id: 7,
        question: 'Can medication help with mental health conditions?',
        answer: 'Medication can be effective for many mental health conditions, especially when combined with therapy. A psychiatrist or primary care physician can evaluate whether medication might be helpful for your specific situation and monitor your response to treatment.'
      },
      {
        id: 8,
        question: 'How can I support a friend or family member with mental health struggles?',
        answer: 'Listen without judgment, offer emotional support, encourage professional help if needed, learn about their condition, maintain boundaries, and take care of your own mental health. Avoid trying to "fix" them or giving unsolicited advice.'
      },
      {
        id: 9,
        question: 'What are some daily habits that support mental health?',
        answer: 'Regular exercise, adequate sleep, healthy nutrition, mindfulness or meditation, social connections, limiting alcohol and caffeine, setting boundaries, engaging in hobbies, spending time in nature, and practicing gratitude can all support mental wellbeing.'
      },
      {
        id: 10,
        question: 'Is it normal to have multiple mental health conditions?',
        answer: 'Yes, having multiple mental health conditions (comorbidity) is common. For example, anxiety and depression often occur together. A qualified mental health professional can provide comprehensive assessment and develop an integrated treatment plan.'
      },
      {
        id: 11,
        question: 'How do I find the right therapist for me?',
        answer: 'Consider your specific needs, preferred therapy style, practical factors like location and insurance, and personal comfort level. Many therapists offer brief consultations to discuss fit. Don\'t hesitate to try a few different therapists until you find the right match.'
      },
      {
        id: 12,
        question: 'What is the difference between anxiety and stress?',
        answer: 'Stress is typically a response to external pressures and usually subsides when the stressor is removed. Anxiety can persist even without clear external triggers and may involve excessive worry about future events. Both can benefit from similar coping strategies and professional support.'
      },
      {
        id: 13,
        question: 'Can children and teenagers benefit from mental health support?',
        answer: 'Absolutely. Children and teenagers can experience mental health challenges and benefit greatly from age-appropriate therapy and support. Early intervention can prevent more serious problems and teach valuable coping skills for life.'
      },
      {
        id: 14,
        question: 'What role does nutrition play in mental health?',
        answer: 'Nutrition significantly impacts mental health. A balanced diet rich in omega-3 fatty acids, complex carbohydrates, lean proteins, and vitamins supports brain function. Limiting processed foods, excessive sugar, and alcohol can help stabilize mood and energy levels.'
      },
      {
        id: 15,
        question: 'How can I manage mental health symptoms during stressful periods?',
        answer: 'During stressful times, prioritize self-care basics like sleep and nutrition, use stress-reduction techniques like deep breathing or meditation, maintain social connections, limit additional stressors when possible, and don\'t hesitate to seek professional support.'
      },
      {
        id: 16,
        question: 'What are some warning signs of a mental health crisis?',
        answer: 'Warning signs include thoughts of self-harm or suicide, severe mood changes, inability to perform daily tasks, substance abuse, disconnection from reality, or extreme agitation. If you or someone you know shows these signs, seek immediate professional help or contact emergency services.'
      },
      {
        id: 17,
        question: 'How does exercise impact mental health?',
        answer: 'Regular exercise releases endorphins, reduces stress hormones, improves sleep, boosts self-esteem, and provides social interaction opportunities. Even moderate exercise like walking for 30 minutes can significantly improve mood and reduce anxiety and depression symptoms.'
      },
      {
        id: 18,
        question: 'What is the importance of sleep for mental health?',
        answer: 'Quality sleep is crucial for emotional regulation, cognitive function, and mental health. Poor sleep can worsen anxiety, depression, and other mental health conditions. Maintaining good sleep hygiene and addressing sleep disorders can significantly improve mental wellbeing.'
      },
      {
        id: 19,
        question: 'Can mindfulness and meditation really help with mental health?',
        answer: 'Yes, research shows mindfulness and meditation can reduce symptoms of anxiety, depression, and stress. These practices help develop awareness of thoughts and emotions, improve emotional regulation, and can be learned through apps, classes, or working with a qualified instructor.'
      },
      {
        id: 20,
        question: 'How do I maintain mental health during major life changes?',
        answer: 'During major transitions, acknowledge that change is stressful, maintain routines where possible, seek support from friends and family, practice self-compassion, focus on what you can control, and consider professional support to navigate the adjustment period successfully.'
      }
    ];

    // Initialize displayed FAQs
    this.displayedFaqs = this.allFaqs.slice(0, this.faqsPerPage);
  }

  /**
   * Toggle the expansion state of a mental health disorder
   */
  toggleDisorder(disorderId: number): void {
    if (this.expandedDisorders.has(disorderId)) {
      this.expandedDisorders.delete(disorderId);
    } else {
      this.expandedDisorders.add(disorderId);
    }
  }

  /**
   * Show more FAQs
   */
  showMoreFaqs(): void {
    const currentLength = this.displayedFaqs.length;
    const nextBatch = this.allFaqs.slice(currentLength, currentLength + this.faqsPerPage);
    this.displayedFaqs = [...this.displayedFaqs, ...nextBatch];
  }

  /**
   * Show less FAQs (reset to initial 10)
   */
  showLessFaqs(): void {
    this.displayedFaqs = this.allFaqs.slice(0, this.faqsPerPage);
  }
}
