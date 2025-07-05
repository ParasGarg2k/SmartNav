import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';

interface FloatingVoiceAssistantProps {
  isVisible?: boolean;
}

const FloatingVoiceAssistant: React.FC<FloatingVoiceAssistantProps> = ({ isVisible = true }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true); // Start minimized
  const [audioLevel, setAudioLevel] = useState(0);

  // Hardcoded questions and answers
  const hardcodedQA = {
    "Where is almond milk?": {
      answer: "Almond milk is located in Aisle D2 (Dairy alternatives section). Current stock level: 5/30.",
      suggestions: ['Check nearby stores', 'Find alternatives', 'Notify when restocked']
    // },
    // "What's the nutrition info for whole wheat bread?": {
    //   answer: "Great Value Organic Whole Wheat Bread Nutrition: B+ Score, 110 calories per slice, 4g protein, 22g carbs, 3g fiber. Ingredients: Organic whole wheat flour, water, organic cane sugar, yeast, sea salt, organic sunflower oil. Allergens: Wheat.",
    //   suggestions: ['Compare with other breads', 'Check gluten-free options', 'Find recipes']
    // },
    // "Is organic chicken breast in stock?": {
    //   answer: "Organic chicken breast is currently in stock in Aisle P1 (Proteins section). Price: $8.99/lb. Current stock level: 25/50. Would you like me to add it to your shopping list?",
    //   suggestions: ['Add to shopping list', 'Check other protein options', 'Find recipes']
    }
  };

  const startListening = () => {
    setIsListening(true);
    setAudioLevel(0);
    
    // Simulate audio level animation
    const audioInterval = setInterval(() => {
      setAudioLevel(prev => Math.min(prev + Math.random() * 20, 100));
    }, 100);

    // Simulate voice recognition after 2 seconds
    setTimeout(() => {
      const questions = Object.keys(hardcodedQA);
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      setTranscript(randomQuestion);
      handleVoiceCommand(randomQuestion);
      setIsListening(false);
      setAudioLevel(0);
      clearInterval(audioInterval);
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
    setAudioLevel(0);
  };

  const handleVoiceCommand = (command: string) => {
    const qa = hardcodedQA[command as keyof typeof hardcodedQA];
    if (qa) {
      setResponse(qa.answer);
      // Simulate typing effect
      setTimeout(() => {
        speakResponse(qa.answer);
      }, 1000);
    } else {
      setResponse("I'm sorry, I don't have information about that. Try asking about almond milk, whole wheat bread, or organic chicken breast.");
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isMinimized ? (
        <Button
          onClick={() => setIsMinimized(false)}
          className={`h-14 w-14 rounded-full transition-all duration-300 shadow-lg ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {isListening ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
        </Button>
      ) : (
        <Card className={`w-80 shadow-xl border-2 border-blue-200 bg-white/95 backdrop-blur-sm transition-all duration-300 ${
          isExpanded ? 'h-96' : 'h-64'
        }`}>
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-sm text-gray-700">Voice Assistant</span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-6 w-6 p-0"
                >
                  {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(true)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Voice Button */}
            <div className="flex justify-center mb-4">
              <Button
                onClick={toggleListening}
                className={`h-16 w-16 rounded-full transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white shadow-lg`}
              >
                {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
              </Button>
            </div>

            {/* Audio Level Indicator */}
            {isListening && (
              <div className="flex justify-center items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-100 ${
                      audioLevel > (i + 1) * 20 ? 'bg-red-500' : 'bg-gray-300'
                    }`}
                    style={{ height: `${Math.max(8, audioLevel * 0.3)}px` }}
                  />
                ))}
              </div>
            )}

            {/* Status */}
            <div className="text-center mb-3">
              <Badge variant={isListening ? "destructive" : "secondary"} className="text-xs">
                {isListening ? "Listening..." : "Ready"}
              </Badge>
            </div>

            {/* Transcript */}
            {transcript && (
              <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">You said:</p>
                <p className="text-sm font-medium">{transcript}</p>
              </div>
            )}

            {/* Response */}
            {response && (
              <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">Assistant:</p>
                <p className="text-sm">{response}</p>
              </div>
            )}

            {/* Quick Questions */}
            {!isListening && !transcript && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center mb-2">Try asking:</p>
                {Object.keys(hardcodedQA).map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTranscript(question);
                      handleVoiceCommand(question);
                    }}
                    className="w-full text-xs h-8"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {response && hardcodedQA[transcript as keyof typeof hardcodedQA]?.suggestions && (
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Suggestions:</p>
                <div className="flex flex-wrap gap-1">
                  {hardcodedQA[transcript as keyof typeof hardcodedQA].suggestions?.map((suggestion, index) => (
                    <Badge key={index} variant="outline" className="text-xs cursor-pointer hover:bg-gray-100">
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FloatingVoiceAssistant; 
