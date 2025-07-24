'use client'
import { useState } from 'react'

const fields = [
  { name: "Pclass", label: "탑승자 등급 (1, 2, 3)", type: "number" },
  { name: "Sex", label: "성별", type: "select", options: ["남성", "여성"] },
  { name: "Age", label: "나이", type: "number" },
  { name: "SibSp", label: "같이 탄 배우자, 형제자매 수", type: "number" },
  { name: "Parch", label: "같이 탄 부모/자녀 수", type: "number" },
  { name: "Fare", label: "티켓값 ($)", type: "number" },
  { name: "Embarked", label: "탑승 위치", type: "select", options: ["S", "C", "Q"] }
]

export default function PredictPage() {
  const [formData, setFormData] = useState({
    Pclass: 3,
    Sex: "male",
    Age: 22,
    SibSp: 0,
    Parch: 0,
    Fare: 7.25,
    Embarked: "S"
  })

  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    const field = fields.find(f => f.name === name)
    const val = field?.type === "number" ? Number(value) : value
    setFormData({ ...formData, [name]: val })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch("https://titanicapp.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      setResult(data.survived === 1 ? "✅ 생존" : "❌ 사망")
    } catch (err) {
      setResult("⚠️ 서버 도달 실패.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">🛳 타이타닉 생존 예측기</h1>

      {fields.map(field => (
        <div key={field.name} className="mb-4">
          <label htmlFor={field.name} className="block font-medium mb-1">{field.label}</label>

          {field.type === "select" ? (
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            >
              {field.options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow disabled:opacity-50"
      >
        {loading ? "예측중..." : "예측하기"}
      </button>

      {result && (
        <div className="mt-6 p-4 text-center text-lg rounded bg-gray-100 border">
          {result}
        </div>
      )}
    </div>
  )
}
